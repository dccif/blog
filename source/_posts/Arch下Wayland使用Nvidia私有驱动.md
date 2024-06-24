---
title: "Arch下Wayland使用Nvidia私有驱动"
date: 2024-06-24 10:13:12
categories: 编程
tags:
  - 编程
  - 环境搭建
---

# 起因:

最近因为家用的 windows 机器遇到可能是硬件上的故障无法正常使用，没办法，为了有一台电脑用，将之前家用的 pve 上的 vGPU 也卸载了，为了性能使用了显卡直通+Nvidia 专有驱动来运行 Arch 虚拟机，但是发现在最新的 KDE+Wayland 下，默认显示全是黑屏，只有一个光标，无法正常使用。在各种地方查看了之后终于配置成功了，写下这篇文章以帮助其他朋友和备忘。

<!--more-->

## 安装 软件包与编译环境

```shell
sudo pacman -Syu
sudo pacman -S base-devel linux-headers git nano --needed
```

## 安装 nvidia 驱动

```shell
sudo pacman -S nvidia nvidia-utils nvidia-settings lib32-nvidia-utils
or
sudo yay -S nvidia nvidia-utils nvidia-settings lib32-nvidia-utils
```

本人使用的 [archinstall](https://github.com/archlinux/archinstall)，这一步应该是默认安装的，关键是后续的配置，只是先写在这里。

## Wayland 环境变量配置

这下面的才是关键：

NVIDIA-specific options in the root environment file `/etc/environment`

```
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
ENABLE_VKBASALT=1
LIBVA_DRIVER_NAME=nvidia
```

需要将如上变量写入/etc/environment

## kernel modules 配置

找到 `/etc/mkinitcpio.conf`

找到 `MODULES=()`行，在`()`中加入 `nvidia nvidia_modeset nvidia_uvm nvidia_drm`

找到 `HOOKS=()`行，如果`()`中有`kms`,则删除

新建一个文件 `/etc/modprobe.d/nvidia.conf` 文件,内容如下:

```
blacklist nouveau
options nvidia_drm modeset=1 fbdev=1
```

之后最关键的一步

```shell
sudo mkinitcpio -P
```

更新 initramfs

## 配置 Pacman Hook

新建一个文件比如：nvidia.hook,内容如下

```
[Trigger]
Operation=Install
Operation=Upgrade
Operation=Remove
Type=Package
Target=nvidia
Target=linux
# Adjust line(6) above to match your driver, e.g. Target=nvidia-470xx-dkms
# Change line(7) above, if you are not using the regular kernel For example, Target=linux-lts

[Action]
Description=Update Nvidia module in initcpio
Depends=mkinitcpio
When=PostTransaction
NeedsTargets
Exec=/bin/sh -c 'while read -r trg; do case $trg in linux) exit 0; esac; done; /usr/bin/mkinitcpio -P'
```

文件中的注释可以不用调整，面向的是老驱动以及非官方内核

最后将文件移动到`/etc/pacman.d/hooks/`下

## 完成

正常情况就可以重启了，这下可以愉快地使用 Walyland 了并且运行在 nvidia 私有驱动下了

## 一键脚本

如果上文不想看，那么直接新建一个`nvidia.sh`文件，文件名任意

内容如下

```shell
#!/bin/bash

# 定义要写入 /etc/environment 的变量
nvidia_variables=(
    "GBM_BACKEND=nvidia-drm"
    "__GLX_VENDOR_LIBRARY_NAME=nvidia"
    "ENABLE_VKBASALT=1"
    "LIBVA_DRIVER_NAME=nvidia"
)

backup_file() {
    local file=$1
    sudo cp "$file" "$file.bak"
}

update_environment() {
    local env_file="/etc/environment"
    backup_file "$env_file"

    for var in "${nvidia_variables[@]}"; do
        if grep -q "^${var%%=*}" "$env_file"; then
            sudo sed -i "s|^${var%%=*}.*|$var|" "$env_file"
        else
            echo "$var" | sudo tee -a "$env_file" > /dev/null
        fi
    done

    echo "NVIDIA-specific options have been written to $env_file."
}

update_mkinitcpio_conf() {
    local mkinitcpio_conf="/etc/mkinitcpio.conf"
    backup_file "$mkinitcpio_conf"

    sudo sed -i '/^MODULES=/ s/(\(.*\))/(\1 nvidia nvidia_modeset nvidia_uvm nvidia_drm)/' "$mkinitcpio_conf"
    sudo sed -i '/^HOOKS=/ s/\(\s*kms\s*\)//g' "$mkinitcpio_conf"

    echo "mkinitcpio.conf has been updated."
}

create_nvidia_conf() {
    local nvidia_conf="/etc/modprobe.d/nvidia.conf"
    sudo bash -c "cat > $nvidia_conf" <<EOL
blacklist nouveau
options nvidia_drm modeset=1 fbdev=1
EOL

    echo "$nvidia_conf has been created."
}

regenerate_initramfs() {
    sudo mkinitcpio -P
    echo "initramfs has been regenerated."
}

create_nvidia_hook() {
    local hook_dir="/etc/pacman.d/hooks"
    local hook_file="$hook_dir/nvidia.hook"

    sudo mkdir -p "$hook_dir"

    sudo bash -c "cat > $hook_file" <<EOL
[Trigger]
Operation=Install
Operation=Upgrade
Operation=Remove
Type=Package
Target=nvidia
Target=linux
# Adjust line(6) above to match your driver, e.g. Target=nvidia-470xx-dkms
# Change line(7) above, if you are not using the regular kernel For example, Target=linux-lts

[Action]
Description=Update Nvidia module in initcpio
Depends=mkinitcpio
When=PostTransaction
NeedsTargets
Exec=/bin/sh -c 'while read -r trg; do case \$trg in linux) exit 0; esac; done; /usr/bin/mkinitcpio -P'
EOL

    echo "nvidia.hook has been added to $hook_dir."
}

main() {
    update_environment
    update_mkinitcpio_conf
    create_nvidia_conf
    regenerate_initramfs
    create_nvidia_hook
}

main


```

添加运行权限与执行

```shell
chmod +x nvidia.sh && ./nvidia.sh
```

## 参考

最后感谢这些文章的作者，Thanks

[arch-nvidia-drivers-installation-guide](https://github.com/korvahannu/arch-nvidia-drivers-installation-guide)

[Black screen at Wayland startup](https://wiki.archlinux.org/title/NVIDIA/Troubleshooting)
