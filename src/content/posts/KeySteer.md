---
title: 'KeySteer：给键盘加个方向盘，让鼠标歇一会儿'
slug: 2026/09/26/keysteer
published: 2026-09-26T12:00:00+08:00
description: 我开发的 KeySteer，是一个用键盘控制鼠标和窗口的小工具。移动、点击、分屏、整理窗口，让双手少一点来回折返跑。
tags:
  - 开源
  - 效率工具
category: 编程
draft: false
lang: zh-CN
---

写代码时，手指在键盘上忙得飞起，突然需要点一下按钮：右手出发，找到鼠标，点击，再回到键盘。

按钮只点了一下，右手倒是完成了一次通勤。

所以，来介绍一下我开发的 [KeySteer](https://github.com/dccif/KeySteer)：一个支持 Windows 和 macOS 的键盘操控工具，可以用键盘移动鼠标、点击界面，也能移动和整理窗口。名字里的 Steer 是掌舵的意思——这次让键盘握方向盘。

## 鼠标的活，键盘也能接一点

如果你熟悉 Vim，`h j k l` 这四位老朋友又来上班了：分别控制鼠标向左、下、上、右移动，再配合按键完成点击、滚动和拖拽。

目标离得远，也不用一路“开”过去。Grid 可以用网格快速定位，Recursive Grid 可以逐层缩小范围；UI Hint 则给识别到的按钮、链接等界面元素贴上字母标签，输入标签就能定位。

有点像给屏幕上的按钮发了门牌号。找得到门牌，就不用挨家敲门。

## 窗口太多？顺手收拾一下

KeySteer 还有 Window 模式：移动、缩放、居中、跨屏，以及快速分屏、自动平铺。窗口开得像一桌没收拾的麻将时，总算有个整理的办法。

Tabs 可以把窗口组成标签组，布局和分组安排也能存成预设。不过它记住的是“桌子怎么摆”，不是替你把所有应用重新开一遍。

## 先试一分钟

从 [GitHub Releases](https://github.com/dccif/KeySteer/releases) 下载对应系统的版本。Windows 解压后运行 `KeySteer.exe`；macOS 的安装和权限设置可以参考[项目说明](https://github.com/dccif/KeySteer#安装)。

第一次不用背整本快捷键手册，先试这一小段：

1. 按 `Primary+E` 进入鼠标操控模式。
2. 用 `h j k l` 移动，按 `;` 左键点击。
3. 按 `Esc` 退出，继续正常打字。

默认的 `Primary` 在 Windows 上是左 `Alt`，在 macOS 上是 `Command`。想整理窗口，可以再试试 `Primary+W`。键位不顺手也能改，毕竟工具应该适应人，没必要让手指重新投胎。

更多功能和操作示例放在[文档与在线模拟器](https://dccif.github.io/KeySteer/)。项目已经开源，欢迎试用，也欢迎到 [GitHub](https://github.com/dccif/KeySteer) 提问题、聊建议。

鼠标先别扔。只是有些时候，可以让它带薪休假一下。😂
