---
title: IDEA下的Java Webapp环境搭建
slug: 2017/10/14/IDEA下的Java-Webapp环境搭建
published: 2017-10-14T15:14:55+08:00
description: 本文在以下环境搭建：
tags:
  - 环境搭建
category: 编程
draft: false
lang: zh-CN
---

# IDEA 下 Java Webapp 的环境搭建

本文在以下环境搭建：

> IntelliJ IDEA 2017.2.5
> JDK 1.8.0_144
> JRE: 1.8.0_152-release-915-b12 amd64
> JVM: OpenJDK 64-Bit Server VM by JetBrains s.r.o
> Apache Tomcat 9.0.1 Server
> Windows 10 x64 15063.674

**注意!!** 本文不包括 JAVA 环境及 Tomcat 的搭建！

<!--more-->

## 写文缘由

可能有人问我既然不是写给新人看的，还不写重点的 JAVA 环境及 Tomcat 的搭建，你写这有什么用？那么你可以**Ctrl+w**了。因为现在网上的都是关于 Eclipse 或者老版本的 IDEA 的教程，所以想写一篇新的，顺带拉一波新人入 IDEA 的坑。

~~个人不喜欢课堂上老师用的旧工具~~

### 新建 Project

![新建项目](/image/IDEA/newproject.jpg)

![选择应用module](/image/IDEA/select.jpg)

下一步随便给项目取一个名字

### **下面是重点了**

可能是我的环境太新了，和网上的教程生成的目录结构是不一样的。

![目录结构](/image/IDEA/struct.jpg)

我们要新建 2 个文件夹，都是在 web/WEB-INF/目录下

1. classes &nbsp;&nbsp;&nbsp;&nbsp; --编译后的文件
2. lib &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --以后要引入的库

### 新的目录结构 ![新建Servlet和新的目录结构](/image/IDEA/after.jpg)

![新建Servlet](/image/IDEA/newservlet.jpg)

### 更改项目目录结构 ![更改目录结构](/image/IDEA/newstruct.jpg)

#### 更改 out 目录 ![更改out目录](/image/IDEA/newout.jpg)

#### 更改 lib 目录 ![更改lib目录](/image/IDEA/newlib.jpg)

#### 更改 out 结构 ![更改out结构](/image/IDEA/outset.jpg)

### 配置服务器 ![配置服务器](/image/IDEA/configserver.jpg)

![IDEA下的Java Webapp环境搭建](/image/IDEA/setserver1.jpg)

![配置服务器](/image/IDEA/setserver2.jpg)

## 测试代码

Jsp 测试：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>简单的JSP页面</title>
</head>
<body>
<h1>Hello,World!</h1>
现在的时间是: <%= new java.util.Date() %>
</body>
</html>
```

结果：

![Jsp页面测试](/image/IDEA/result1.jpg)

Servlet 测试：

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "HelloServlet", urlPatterns = {"/helloServlet.do"})
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head><title>当前时间</title></head><body>");
        out.println("<h3>Hello,World!</h3>");
        out.println("现在时间是：" + new java.util.Date());
        out.println("</body>");
        out.println("</html>");
    }
}
```

结果：
![Servlet测试](/image/IDEA/result2.jpg)

## 搭建完成

至此完成了在 IDEA 上 Servlet 的环境搭建。

~~你以为接这样结束了？~~

你难道想每次都按怎么多才能搭建好环境？
~~其实可以选择 Maven 的，但是 Maven 更难掌握~~
有个简单的方法能节省几步以后搭建的操作

### 保存模版

![保存模版](/image/IDEA/savetemp.jpg)

之后就能看到了

![用户模版](/image/IDEA/usertemp.jpg)

然而这个功能支持 Java 项目并不完美，所以以后每次都要新建两个文件夹，就是 classes 和 lib，但之后的目录结构设置会自动完成的
