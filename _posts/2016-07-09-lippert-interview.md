---
layout: post
title:  "Интервью с Эриком Липпертом"
date:   2016-07-09 19:24:56 +0300
---

![My helpful screenshot]({{ site.url }}/images/eric-lippert.jpg)

1. **Мы слышали, что вы недавно присоединились к Facebook. Расскажите нам о своей новой работе.**    
В Facebook я пришел в начале 2016го года и у меня сейчас чудесное время. Facebook вкладывает много времени и сил в инструменты с открытым исходным кодом для разработчиков, и есть много интересных задач в этом направлении, особенно учитывая масштаб, в котором работает Facebook. Конкретно я работаю над улучшением языка Hack и его компилятора. Hack это частично типизированная (gradually-typed) версия PHP с интересной системой типов.  

2. **Если бы вы начинали свою карьеру сейчас, какие языки бы вы изучали и почему?**  
Конкретные делали различных языков - это всего лишь детали. В начале карьеры важнее получить набор концепций, которые помогут в решении проблем. Я бы посоветовал начинающим программистам изучить хотя бы один объектно ориентированный язык - C++, C#, Java, Visual Basic, и хотя бы один функциональный язык - F#, OCaml, Haskell, Scheme и.т.д. Если вы будете сильны в концепциях, переходить с языка на язык будет не сложно.  

3. **Какое ваше главное достижение в области разработки?**  
Оглядываясь назад, могу сказать, что я горжусь архитектурой C# компилятора Roslyn. Построение нового компилятора промышленного класса с нуля, это редкое удовольствие в нашем деле. Мне очень повезло быть частью этого проекта с самого начала. Я очень рад, что он наконец-то выпущен и успешен.  

4. **На сколько сильно тот факт, что Roslyn это "Копилятор как сервис" с public API повлиял на его внутреннюю структуру? Насколько это похоже на стандартный компилятор "черный ящик" , которым нас учили на курсах в университете?**  
Две вещи приходят в голову. 
По-первых, API Roslyn-а было разработано, чтобы быть очень "функциональным" и в тоже время, написано на ОО языке. Например синтакические деревья неизменяемые; вы не можете ничего изменить в синтаксическом дереве, в результате изменения синтаксического дерева вы получите новое синтаксическое дерево. Такой выбор дазайна архитектуры компилятора имеет далеко идущие последствия.  
Во-вторых, требования к производительности Roslyn-а существенно отличаются от требований к традиционным компиляторам. Roslyn-у необходимо работать в обоих сценариях, когда компилятор получает огромную гору исходного кода и должен сгенерировать сборку как можно быстрее, а также в режиме "IDE", где в минуту производится много небольших правок и IntelliSense анализ должен быть быстрым и точным. Огромное количество работы было сделано по оптимизации работы компилятора в этих двух сценариях. Вы обычно не увидите такого в традиционном компиляторе.  

5. **При разработке Roslyn-а у вас не возникало расхождений между спецификацией и поведением текущего компилятора? Если возникало, то как вы справлялись с ними? Следовали спецификации или поведению текущего компилятора?**  
Постоянно! И решение каждого из них требовало проведения встреч между программистами, дизайнерами и тестировщиками. Спецификация состоит из 800та страниц, и есть много мест, куда могли закрасться ошибки.  
Как правило, если бы я нашел нарушение спецификации, я бы написал простейшую программу для воспроизведения поведения отличающегося от спецификации. С минимальным примером гораздо проще понять многие вещи.  
Дальше я бы подумал, существуют ли реальные сценарии работы программ которые опираются на C# компилятор реализующий спецификацию не совсем правильно. Если да, то нужно либо изменить спецификацию, чтобы она соответствовала реализации, либо намеренно не исправлять ошибку и оставить нарушение спецификации навсегда.  
Если хотите посмотреть на примеры, просто откройте исходники Roslyn-а и поищите слова "deliberate spec violation". Я не хотел, чтобы кто-нибудь нашел и исправил баг, который мы решили не исправлять, поэтому очень тщательно все это документировал.  


6. **Асинхронное программирование с async/await вероятно одна из самых ярких фич, первоначально введенных в C# 5.0, но сейчас оно нашло свое место во многих других языках, таких как JavaScript, Python, Dart и.т.д. Функционал асинхронного программирования был улучшен в C# 6.0 поддержкой асинхронных вызовов в catch и finally блоках. Может ли эта модель быть расширена дальше?Например, поддержкой асинхронных итераторов(async Task\<IEnumerable\<T\>\> который может и yield и await)**  
Прежде всего, просто чтобы прояснить вопрос: asynchronous waits были добавлены в C# 5.0, но были и другие языки, которые получили такой функционал гораздо раньше. Дизайн feature в C# 5.0 был под сильным влиянием асинхронного программирования в F#, например.  
Можно ли расширить этот функционал дальше? Определенно. Нет никаких логических препятствий для такого рода комбинаций. Как и любой функционал, это вопрос приоритетов; кто-то должен проектировать, реализовывать, тестировать и документировать каждую фичу, и это значит, что будут страдать другие фичи, которые могли бы быть более полезными.  

7. **Хотя вы больше не часть команды C#, вы следите за конструкциями C# 7.0? Что вам нравится из новых фич? Какая ваша любимая и почему?**  
Я с интересом слежу за процессом развития языка, но особо не участвую. В связи с работой над языками в течение дня, редактированием книг, и написанием блога о программировании, у меня остается не так много времени чтобы участвовать в проектировании C#. Я иногда суюсь туда, но и проектная группа достаточно хороша, чтобы пригласить меня на обед.  
Я очень доволен предложенными фичами для предстоящих версий C#. Мы долго и упорно работали над Roslyn, чтобы сделать прочный фундамент для быстроразвивающихся фич. Больше всего в предстоящих версиях C# я жду фичи, которые вдохновлены функциональными языками, такие как tuples и pattern matching. Я несколько месяцев работал на OCalm, и очень привык к ним.  

8. **Почему C# не поддерживает преобразований лямбда выражений в деревья выражений? Это сложно реализовать? Или это недостаточно важно для команды C#? Вы не знаете, не будет ли это включено в будущих версиях?**  
Преобразование лямбд в деревья выражений это одна из моих фич для C# 3.0, так что я хорошо знаком с этим! Расширенный функционал не был реализован в C# 3.0 потому, что этого не требовалось для LINQ, и у нас было мало времени на этот релиз. Дело в том, что LINQ требует большое количество возможностей языка эффективно работающих вместе. Соответственно любые лишние фичи были вырезаны.  
Опять же, это сводится к альтернативным возможностям. Фича концептуально не сложная, но требующая большого количества времени. Существует большое число операторов в C# и нужно написать логику, которая будет преобразовывать их все в формат деревьев выражений. Также написать много тестов, много документации, и так далее. Это довольно дорогая фича, но она не добавляют много возможностей в язык; эти усилия, вероятно, могли быть потрачены в другом месте. Если бы мы могли получить это бесплатно, тогда конечно, это было бы здорово, но увы. Я не знаю ничего о планах по этому поводу, и совсем ничего об этом не слышал.  

9. **Много новых и грядущих фич C# делают функциональное программирование на C# проще. Как вы думаете, куда все идёт? Как вы видите будущее функционального программирования в C#? Каким вы видите будущее F#? Или он будет просто лабораторией новых возможностей, которые в конечном счете будут попадать в C#?**  
Как я уже говорил, мне нравится эта тенденция и я вижу, что она продолжается. В течение последних нескольких десятилетий идет настоящее возрождение функционального программирования. Преимущества функционального программирования многочисленны: код легче, т.к. имеет меньше побочных эффектов, код может более легко и безопасно распараллеливаться и.т.д.  
Трудно будет внести эти функции в C# сохранив "дух" языка. Когда я впервые увидел "pattern matching" для C#, я был сильно впечатлен тем как дизайнерам языка удалось взять фичу из функциональных языков, таких как OCalm или Haskell, и сделать её естественным продолжением C#.  
Также я вижу светлое будущее для F#. Оба языка прекрасны; C# привлекателен для ОО разработчиков, которые смогут получить возможности функциональных фич, и F# привлекателен для разработчиков, которым в первую очередь нравится программирование в функциональном стиле, но вынужденных взаимодействовать с миром полным библиотек, написанных на ОО языках программирования. .Net платформа фундаментально многоязычна, в ней есть много места для F#  

10. **Мы уже видели сильное изменение отношения Microsoft к Open Source. Гипотетически, если бы C# был изначально открытым, каким он бы был, по сравнению с текущим его вариантом?**  
Я считаю что является исходный код открытым или нет, на самом деле не влияет на дизайн языка. Главным фактором влияющим на дизайн языка C# является процесс проектирования, который в настоящий момент открыт. Предоставление идей на суд общественности, безусловно, имеет свою цену, но преимущества перевешивают.  
Трудно сказать, на сколько все было бы иначе, если бы процесс проектирования был более открытым с самого начала. Я подозреваю, что было бы сложнее получить хорошее обсуждение больших, сложных, далеко идущих возможностей, таких как Generic или Linq, и легче получить обратную связь по маленьким фичам, которые влияют на повседневную жизнь разработчиков.  

11. **У вас замечательная карьера. Как стать на столько же хорошим, как Эрик Липперт? Какие квалификации (как академические, так и профессиональные) нужны, чтобы быть столь же успешным, как вы?**  
Это мило с вашей стороны, но я хочу отвергнуть исходное предположение вашего вопроса. Я знаю многих успешных разработчиков, которые имеют совершенно другой опыт, чем мой. Я знаю людей которые обладают степенью PhD в теории типов и людей без образования в области Computer science, и они успешны в разработке языков программирования. Что касается меня, изучение информатики в Уотерлу было замечательной подготовкой, но это не является ни необходимым, ни достаточным условием для удачной карьеры.  
Вещи, которые я вижу в большинстве успешных людей в нашей индустрии и которыми я восхищаюсь, это желание изучать что-то новое, получение удовольствия при передачи знаний другим, и готовность придерживаться этого в течение длительного времени.  

12. **Какие новые увлечения/личные проекты у вас появились с нашей последней встречи? Мы хотели бы увидеть видео, где вы играете на пианино или гавайской гитаре!**  
Я был занят изучением нескольких новых для меня языков программирования, т.к. я  присоединился к Facebook, и поэтому я пренебрегаю своими хобби. Есть хорошее пианино в столовой Facebook, и я снова начал играть в последнее время. Я посмотрю, смогу ли я сделать для вас видео!

13. **Наконец, подводя итоги, может поделишься с читателями жемчужинами или скрытыми возможностями C#.**  
Я оставлю читателям свою любимую небольшую головоломку, которая показывает, что система типов C# может быть сложнее, чем вы думаете:

{% highlight csharp %}

public class A<T> {
  public class B : A<int> {
    public void M() { System.Console.WriteLine(typeof(T)); }
    public class C : B { }
  }
}

public class P {
  public static void Main() { (new A<string>.B.C()).M(); }
}

{% endhighlight %}

Как вы думаете, что эта программа выведет, и почему? Теперь запустите этот код и посмотрите, были ли вы правы. Если ошиблись - на расстраивайтесь. Я в первый раз тоже ошибся!