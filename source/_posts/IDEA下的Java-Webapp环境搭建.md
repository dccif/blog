---
title: IDEA下的Java Webapp环境搭建
categories: 编程
tags: 环境搭建
date: 2017-10-14 15:14:55
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

{% img /image/IDEA/newproject.jpg 新建项目 %}

{% img /image/IDEA/select.jpg 选择应用module %}

下一步随便给项目取一个名字

### **下面是重点了**

可能是我的环境太新了，和网上的教程生成的目录结构是不一样的。

{% img /image/IDEA/struct.jpg 目录结构 %}

我们要新建 2 个文件夹，都是在 web/WEB-INF/目录下

1. classes {% raw %}&nbsp&nbsp&nbsp&nbsp{% endraw %} --编译后的文件
2. lib {% raw %}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{% endraw %} --以后要引入的库

### 新的目录结构 {% img /image/IDEA/after.jpg 新建Servlet和新的目录结构 %}

{% img /image/IDEA/newservlet.jpg 新建Servlet %}

### 更改项目目录结构 {% img /image/IDEA/newstruct.jpg 更改目录结构 %}

#### 更改 out 目录 {% img /image/IDEA/newout.jpg 更改out目录 %}

#### 更改 lib 目录 {% img /image/IDEA/newlib.jpg 更改lib目录 %}

#### 更改 out 结构 {% img /image/IDEA/outset.jpg 更改out结构 %}

### 配置服务器 {% img /image/IDEA/configserver.jpg 配置服务器 %}

{% img /image/IDEA/setserver1.jpg %}

{% img /image/IDEA/setserver2.jpg 配置服务器 %}

## 测试代码

Jsp 测试：

```Jsp
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

{% img /image/IDEA/result1.jpg Jsp页面测试 %}

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
{% img /image/IDEA/result2.jpg Servlet测试 %}

## 搭建完成

至此完成了在 IDEA 上 Servlet 的环境搭建。

~~你以为接这样结束了？~~

你难道想每次都按怎么多才能搭建好环境？
~~其实可以选择 Maven 的，但是 Maven 更难掌握~~
有个简单的方法能节省几步以后搭建的操作

### 保存模版

{% img /image/IDEA/savetemp.jpg 保存模版 %}

之后就能看到了

{% img /image/IDEA/usertemp.jpg 用户模版 %}

然而这个功能支持 Java 项目并不完美，所以以后每次都要新建两个文件夹，就是 classes 和 lib，但之后的目录结构设置会自动完成的
