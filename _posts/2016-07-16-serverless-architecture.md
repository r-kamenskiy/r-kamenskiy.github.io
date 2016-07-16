---
layout: post
title: "Serverless веб приложение на Azure"
date: 2016-07-16 10:24:56 +0300
---

Этот блог является serverless приложением. Хранится он на github pages, им же и генерируются страницы. И я понятия не имею, как это все там происходит. Как только происходит push в репозиторий, веб-сервер отдает уже обновленную страницу. Бонусом идет полная история версий блога. В общем, сплошные плюсы, но сегодняшний пост не о GitHub pages.

Serverless - архитектура разработки веб приложений (и не только веб), в которой отсутствует сервер, в классическом его понимании. Т.е. это сайт без бекэнда. 

Особенно удачно можно применить этот подход, если все необходимые для вашего приложения API предоставляются какими-то внешними 	сервисами. Вы делаете всю бизнес логику на клиенте и остается только найти способ отдать клиенту статический код. 

<!--more-->

Сегодня я покажу, как можно реализовать serverless приложение на Azure. Приложение будет представлять собой некий сайт с формой отправки данных от пользователя. 
Сайт будет жить в [Azure Web App](https://azure.microsoft.com/en-us/services/app-service/web/), принимать данные с формы будет [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) и сохранять в [DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/)

Сначала создадим Web App.
![]({{ site.url }}/images/serverless/2016-07-16_17-02-08.png)

Всё. Теперь можно туда залить свой сайт, и он будет доступен по ссылке yoursitename.azurewebsites.net. Залить его туда можно [многими способами](https://azure.microsoft.com/en-us/documentation/articles/web-sites-deploy). Свои проекты я предпочитаю заливать через git (и вообще git считаю самым важным инструментом разработчика). Для этого настроим Deployment source и зададим логин/пароль.
![]({{ site.url }}/images/serverless/2016-07-16_17-22-43.png)

![]({{ site.url }}/images/serverless/2016-07-16_17-26-42.png)

После этого во вкладке Setting -> Properties нужно взять Git url. Azure к деплойменту готов.

Создадим файл index.html в папке на жестком диске, где будет храниться сайт перед деплоем. Инициализируем git, добавляем index.html и отправляем в azure.

{% highlight bash %}
git init
git add .
git commit -m "init"
git remote add azure https://bench@r-test-app.scm.azurewebsites.net:443/r-test-app.git
git push azure master

{% endhighlight %}

Сайт готов. 

![]({{ site.url }}/images/serverless/2016-07-16_17-49-41.png)

Теперь нужно написать Azure функцию, которая примет данные и запишет их в DocumentDB(также можно в SQL базу, либо другое хранилище, поддерживаемое Azure).

Создадим базу и коллекцию
![]({{ site.url }}/images/serverless/2016-07-16_18-55-20.png)

Затем создадим Azure function. Писать эти функции можно почти на всех популярных языках (C#, Node.js, Python, F#, PHP, batch, bash, Java). Я предпочитаю C#. Различные примеры можно посмотреть [здесь](https://github.com/Azure/azure-webjobs-sdk-templates)
![]({{ site.url }}/images/serverless/2016-07-16_18-59-24.png)

![]({{ site.url }}/images/serverless/2016-07-16_19-02-03.png)

Нам дают заготовку функции, которая принимает Http запрос, обрабатывает его и отдает ответ. Нам помимо этого нужно сохранить пришедший запрос в базу. 
![]({{ site.url }}/images/serverless/2016-07-16_19-04-40.png)
Идем на вкладку Integrate и в Output добавляем созданную ранее DocementDB базу.
![]({{ site.url }}/images/serverless/2016-07-16_19-07-42.png)
вот примерно так будет выглядеть код, который сохраняет содержимое пришедшего запроса в базу и возвращает 200ый код.
{% highlight csharp %}
using System.Net;

public static void Run(HttpRequestMessage req, out object outputDocument, TraceWriter log)
{
    log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");

    var data = req.Content.ReadAsStringAsync().Result;
    outputDocument = new{
        req = data
    };

    req.CreateResponse(HttpStatusCode.OK, "");
}
{% endhighlight %}

Собственно всё. У нас есть сайт, который деплоится командой git push, есть функция, которая может принимать запросы и сохранять их в базу, и есть сама база. И почти всё это мы просто "накликали".

Понятно, что все это подойдет не для любого проекта. Да и в целом концепция Azure functions (а также amazon lambda, Google CloudFunctions и.т.д.) напоминает хранимые процедуры и для крупных проектов выглядит сомнительно. Так что применять их нужно с умом, и в некоторых случаях они помогают сэкономить уйму времени, а возможно и денег. 