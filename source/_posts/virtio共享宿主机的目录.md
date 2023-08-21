---
title: 在pve下通过9p virtio共享宿主机的目录
date: 2023-08-21 22:36:21
categories: 编程
tags: 
  - 编程
	- 环境搭建
---

> 前提声明本文以下性能数据全是在个人硬件，软件下测的：
> PVE 8.0.4 Linux version 6.2.16-6-pve
> OMV 6.5 Linux version 6.1.0-0.deb11.7-amd64
> smb 共享挂载文档夹后测速

起因：
本人因为不想让虚拟机独占硬盘，于是想出了让虚拟机共享宿主机的文档的方案，于是就在挑选技术，同时感谢[OpenMediaVault：你的开源 NAS 系统](https://zhuanlan.zhihu.com/p/138254689) 韦易笑 指出的 9p 技术
以下是我选择的几种技术的对比，本人才疏学浅，如有错误请 dalao 指出

<!--more-->

|           | 速度                                       | ACL（访问控制权限）                            | 支持系统                       |
| --------- | ------------------------------------------ | ---------------------------------------------- | ------------------------------ |
| Virtio 9p | ![9p](/image/pve/9pspeed.webp)             | 默认支持在虚拟机直接改变宿主机共享文档权限     | Linux                          |
| NFSv4.2   | ![nfs](/image/pve/nfsspeed.webp)           | 无法通过虚拟机设置，需要在宿主机设置           | Linux，windows 额外安装        |
| Virtiofs  | ![virtiofs](/image/pve/virtiofsspeed.webp) | 可选支持是否在虚拟机直接改变宿主机共享文档权限 | Linux,windows 需要额外安装驱动 |

参考上述的表格，我最终选择了使用 9p 共享文档夹。

下面是介绍一下如何设置 9p 共享文档，只需要修改 3 个文档
虚拟机 conf 文档 路径在 pve 下的 `/etc/pve/qemu-server/<你的虚拟机 ID>.conf`

在第一行添加 args：参数

```shell
args: -virtfs local,path=<你要共享的宿主机目录路径>,mount_tag=<你要取名的挂载TAG，之后挂载要用>,security_model=passthrough,id=fs0
```

更具体的参数可以参考 [9psetup](https://wiki.qemu.org/Documentation/9psetup)

Linux 虚拟机启动后，编辑 `/etc/fstab`添加下述一行 请先确保虚拟机内的路径存在，没有就先 mkdir 一个

```shell
取名的挂载TAG   你虚拟机内的挂载路径        9p trans=virtio,version=9p2000.L,rw,share,nobootwait,posixacl,msize=104857600  0  0
```

然后执行 `mount -a` 如果没出错，`mount` 之后就会列出所有目录
之后虚拟机就可以愉快的使用宿主共享出来文档夹了，同时还能设置 ACL
