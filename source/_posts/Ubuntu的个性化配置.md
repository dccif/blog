---
title: Ubuntu的个性化配置
date: 2017-10-27 19:40:10
updated: 
categories: 清单
tags: 环境搭建
---

# Ubuntu下的个性化配置

因为使用Linux开发方便的缘故，我在虚拟机上用全性能搭建了一个Ubuntu环境~~(别问我为什么不装双系统)~~

于是和之前那篇Windows的重装一样，也想写一篇文章记录一下，以后搭建时可以方便一些

<!--more-->

## Java环境

本文参考[How To Install Java with Apt-Get on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-ubuntu-16-04)

这里是Java8

添加Oracle's PPA

```shell
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
```

Then, depending on the version you want to install, execute one of the following commands:

### Oracle JDK 8

```shell
sudo apt-get install oracle-java8-installer
```

### Linux下的添加Java环境变量

Many programs, such as Java servers, use the `JAVA_HOME` environment variable to determine the Java installation location. To set this environment variable, we will first need to find out where Java is installed. You can do this by executing the same command as in the previous section:

```shell
sudo update-alternatives --config java
```

Copy the path from your preferred installation and then open `/etc/environment` using `nano` or your favorite text editor.

```shell
sudo nano /etc/environment
```

At the end of this file, add the following line, making sure to replace the highlighted path with your own copied path.

/etc/environment

```shell
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
```

Save and exit the file, and reload it.

```shell
source /etc/environment
```

You can now test whether the environment variable has been set by executing the following command:

```
echo $JAVA_HOME
```



## 开发环境

Vim-gtk 官方源已经有最新的了，直接apt install 就行了

Emacs (需要手动添加源)

```shell
sudo add-apt-repository ppa:kelleyk/emacs
sudo apt update
sudo apt install emacs25
```

其余jetbrains全家桶，因为没有VS只好用Clion了



## oh-my-zsh配置zsh

ubuntu默认不是zsh，输入下面命令安装 zsh

```shell
sudo apt-get install zsh
```

接下来我们需要下载 oh-my-zsh 项目来帮我们配置 zsh，注意此时一定要用 超级权限。

```shell
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

查看你的zsh位置，输入

```shell
cat /etc/shells
```

```shell
➜  ~ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/bin/zsh
/usr/bin/zsh
➜  ~ 
```

更改默认 shell，输入

```shell
sudo vim /etc/passwd
```

更改 root 和用户默认 shell

```shell
root:x:0:0:root:/root:/usr/bin/zsh
song:x:1000:1000:song,,,:/home/song:/usr/bin/zsh
```

zsh 的配置文件是在用户目录下的 .zshrc

每一行的配置前面都有#号,如果想要配置生效,去掉 #号即可.

## 补全插件 incr.zsh

这个插件的官网是: [Incremental completion on zsh](http://link.zhihu.com/?target=http%3A//mimosa-pudica.net/zsh-incremental.html)

最新版本是 incr-0.2.zsh 

新建一个 incr-0.2.zsh 文件把他放进 用户目录下的 .oh-my-zsh/plugins/incr 目录下，没有的目录自己新建，其实放哪都一样。

分别编辑 root 目录下的 .zshrc 和用户目录下的 .zsnrc

加上一句

```shell
source /home/song/.oh-my-zsh/plugins/incr/incr-0.2.zsh
```

/home/song/.oh-my-zsh/plugins/incr 是你放的不同的目录。

最后还有一个小问题，原来我们用的 超级用户创建的 oh-my-zsh 导致 .oh-my-zsh 目录下的缓存目录 cache 所有者和用户组也是root 这样就导致我们在普通用户下使用有些问题，下面改变 cache的所有者

输入

```shell
chown song:song cache/ -R
```

这样就不会在命令提示时候弹出错误了。

