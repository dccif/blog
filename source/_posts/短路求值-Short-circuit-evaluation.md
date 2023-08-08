---
title: 短路求值(Short-circuit evaluation)
date: 2017-10-10 16:05:27
categories: 编程
tags: 细节
---

# 短路求值

> Short-circuit evaluation

最早是在**php**中接触到的这种求值，后来在学习**Lisp**中又一次接触到了，于是想写一篇文章记录一下，并分享一下，这个被我忽略的可能可以说是细节的点吧

<!--more-->

## 什么是**短路求值（Short-circuit evaluation）**

以下摘自[Short-circuit evaluation](https://www.wikiwand.com/en/Short-circuit_evaluation)

> **Short-circuit evaluation**, minimal evaluation, or McCarthy evaluation (after John McCarthy) is the semantics of some Boolean operators in some programming languages in which the second argument is executed or evaluated only if the first argument does not suffice to determine the value of the expression: when the first argument of the AND function evaluates to false, the overall value must be false; and when the first argument of the OR function
> evaluates to true, the overall value must be true.

概况来说就是在求**布尔表达式**的时候程序并不会执行全部的**Expression**

比如**AND**或者**OR**操作时如果后面第一个 Expression 为 True，那么之后的 Expression 就不会再求值了。

## 一些例子

### 普通的**C**程序

```c
int denom = 0;
if (denom != 0 && num / denom)
{
    ... // ensures that calculating num/denom never results in divide-by-zero error
}
```

### 使用了短路求值的**C**程序

```c
int a = 0;
if (a != 0 && myfunc(b))
{
    do_something();
}
```

在这个例子中**&&**后的**myfunc(b)**将永远不会执行，因为**a!=0**永远是**FALSE**。
利用短路求值有 2 个有用的技巧

1.  如果条件判断的 expression 需要复杂的计算，并且第一个结果为**False**，则可以不计算之后的表达式
1.  可以构造一个 expression 来使第二个可能会发生运行时错误的 expression 成功运行

```c
bool is_first_char_valid_alpha_unsafe(const char *p)
{
    return isalpha(p[0]); // SEGFAULT highly possible with p == NULL
}

bool is_first_char_valid_alpha(const char *p)
{
    return p != NULL && isalpha(p[0]); // 1) no unneeded isalpha() execution with p == NULL, 2) no SEGFAULT risk
}
```

这个例子避免了空指针

### 最近学习的 Lisp 中的例子：

```Lisp
(defparameter *is-it-even* nil)
(or (oddp 5)
(setf *is-it-even* t))
```

利用短路求值，用**OR**实现了条件判断

## 可能的问题：

尽管有上面说的优点，但是可能会带来没有意识到的问题，比如：

```c
if (expressionA && myfunc(b)) {
    do_something();
}
```

当**expressionA**为**True**时无论**do_something()**是否执行，**myfunc(b)**都会执行，例如分配系统资源的操作。

相反，**expressionA**为**False**时**myfunc(b)**永远不会执行

## 支持的语言

**并不是所有语言和所有操作符支持的**
Java 支持**非短路求值**也支持**短路求值**

| 常见的语言               | 支持的操作符   |
| :----------------------- | :------------- |
| C, Obejective-C, C++, C# | &&, ∥, ?       |
| Java, MATLAB, R, Swift   | &&, ∥          |
| JavaScript, GO, Haskel   | &&, ∥          |
| Lisp, Lua, Scheme        | and, or        |
| PHP                      | &&, and, ∥, or |
| Python                   | and, or        |
| Visual Basic             | 不支持         |
