---
layout: post
title: "Плохой хороший Continuos integration"
date: 2016-07-23 10:24:56 +0300
---

Continuous Integration - это набор практик, помогающих избежать многих проблем в ходе разработки ПО.
Основные принципы сформулировал еще 10 лет назад [Martin Fowler](http://martinfowler.com/articles/continuousIntegration.html) (и не он один)

+ Maintain a Single Source Repository.
+ Automate the Build
+ Make Your Build Self-Testing
+ Everyone Commits To the Mainline Every Day
+ Every Commit Should Build the Mainline on an Integration Machine
+ Fix Broken Builds Immediately
+ Keep the Build Fast
+ Test in a Clone of the Production Environment
+ Make it Easy for Anyone to Get the Latest Executable
+ Everyone can see what's happening
+ Automate Deployment<br><br>


Однако, это лишь теория, и эти принципы были многими неправильно поняты. Ведь изначально в статьях не было ничего про реализацию, лишь общие принципы. Также, Мартин не указал (видимо посчитал, что это очевидно) первоочердную цель Continuous Integration методологий. А она состоит в том, что нужно экономить время и деньги людей. Из этого и должны исходить детали конкретной реализации.

Я постараюсь сформулировать основные моменты, которые я считаю главными в CI, также обращая внимание на детали реализации. Я намеренно не буду упоминать каких-либо конкретных программных продуктов, ибо их много и в правильных руках почти любая может решать необходимые задачи.

Все эти пункты основаны на моем опыте, который может не совпадать с вашим. Так что буду рад вашим в комментариям.<br><br>

<!--more-->


1. **Собирает весь код. Вообще весь.** <br><br>
Иногда можно увидеть, что в CI запихивают основной продукт (или несколько основных), а за бортом остаётся все остальное.
Нужно развернуть базу? Вон там лежит скрипт, бери и разворачивай.
Нужна программа для небольшого отчета, которую быстренько написал один из программистов? Вот репозиторий, бери и собирай.
Это все неправильно. CI должен собирать и выкладывать артефакты вообще всего кода, всех репозиториев. Иначе где гарантии, что этот код маленькой утилиты вообще соберется, когда вам понадобится.<br><br>


2. **Простой и доступный для рядовых разработчиков** <br><br>
Очень часто, да хотя чего уж там, почти всегда CI системой заведует некий CI master. Он пишет туда какие-то скрипты; что-то чинит, когда что-то ломается; когда надо что-то добавить - добавляет. Все бы ничего, но такое положение дел мешает исполнению пункта один. Каждый программист должен иметь ~~возможность~~ обязанность все свои модули добавлять в CI. Также он должен настраивать там запуск тестов, ставить триггеры на сборку и прочее. И для дела полезно, чтобы все это программист мог бы сделать сам.
Но и нельзя допустить, чтобы программисты-вредители сломали что-то критичное. Поэтому крайне желательна хоть какая-то система прав и ролей.<br><br>


3. **Не позволяет запихнуть плохой код в стабильные ветки** <br><br>
Как я уже сказал, CI должен помогать программистам.
Поясню на примере одного из проектов в моей компании. Есть такая традиция - если программист отправил коммит, из-за которого упал билд, то он покупает печенье. Печенье, это конечно здорово, но к правильному CI это имеет мало отношения. Если данный коммит плохой, то эти изменения не должны были попасть в стабильную сборку, а программист должен получить уведомление об этом.<br><br>


4. **Собирает и тестирует код вместо программиста** <br><br>
Крупные и средние проекты как правило имеют развесистую систему автотестов. Полная сборка с прогоном всех тестов может занимать очено много времени. Поэтому это время должны тратить build-машины, а не люди. В идеале программист не должен запускать локально никаких тестов и собирать что-то, что долго собирается. Ему нужна кнопка "build and check", которая заставит заняться этой работой CI систему, а программист в это время займется тем, чем ему положено заниматься - программированием.<br><br>


5. **Считает все метрики** <br><br>
Споры на тему нужно ли считать степень покрытия кода тестами или не нужно - стабильное явления. Вопрос "нужно ли что-то делать с процентами покрытия тестами?" каждая команда решает для себя. Я же говорю, что CI должна это считать. А также все возможные в вашем продукте метрики. 
Очень удобно в какой-то момент увидеть, что производительность системы упала на 30% и принять меры. И желательно, чтобы все метрики нормально визуализировались.<br><br>


5. **Нотифицирует необходимых людей** <br><br>
Здесь все просто. Обо всех происшествиях должны узнавать все заинтерисованные люди. Желательно, удобными для них каналами связи.<br><br>


6. **Достаточңо быстрый** <br><br>
Как было сказано в пункте 4, CI делает регулярную, рутиную и блокирующую работу. И хорошо бы, чтобы он делал это быстро.
Здесь обычно все решается параллелизмом. Почти все сейчас можно параллелить. Процесс сборки у многих языков параллелится. Unit тесты параллелятся. Ну и, чтобы было куда параллелить - должно быть достаточное количество build машин.<br><br>


8. **Автоматически все деплоит** <br><br>
Не важно, как выглядит ваш процесс деплоймента. Выкатываете вы dll сборки, jar пакеты либо docker образы. Все это должна уметь делать CI. Также она должна уметить откатить состояние, если что-то пошло не так.<br><br>


Вот такие вроде простые пункты, но редко где можно увидеть выполнения хотя бы половины из них. Особенные споры у меня обычно вызывает пункт 4. Многие считают, что программисты должны тщательно все проверять, прогонять все тесты и лишь потом отправлять свои изменения. Но давайте посчитаем, сколько будет стоить час работы программиста, а сколько час работы build машины. Цифры будут несопоставимые. Поэтому я считаю, что в идеальном мире (который однажды настанет) программисты вообще не должны ждать, пока что-то соберется либо протестируется. Это должно либо быть моментально, либо асинхронно.<br><br>