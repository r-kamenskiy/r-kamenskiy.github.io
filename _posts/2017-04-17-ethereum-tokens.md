---
layout: post
title: "Собственная криптовалюта на ethereum"
date: 2017-04-17 19:24:56 +0300
---
<img src="https://habrastorage.org/files/93e/8dd/767/93e8dd767e0c469483bf5d8aa5277bfd.png" style="width:400px; float:left;"/>

Общая рыночная капитализация глобального рынка криптовалют за последний год выросла с $6 млрд (в январе 2016 года) до $28 млрд (на текущий момент). С начала 2017 года рынок криптовалют вырос примерно в полтора раза. На биржах торгуются уже больше сотни разных криптовалют. Крупные организации объединяются в консорциумы, чтобы выпускать свою валюту. Даже государства делают свои национальные криптовалюты. Технологии блокчейна дошли до такого уровня, что уже почти любой может запустить свою криптовалюту, чем мы в этой статье и займемся. Легче всего создать свои монеты на смарт контрактах на базе ethereum.

<!--more-->
Зайдя на крупнейшую в настоящий момент биржу криптовалют, вверху списка можно найти к примеру следующие валюты: GNT (Golem), REP (Augur).

<img src="https://habrastorage.org/files/769/ead/161/769ead1610854a6e95d5a74240e29888.png"/>

Хотя они и находятся в одном списке с Bitcoin (первая и самая известная криптовалюта) и Ethereum (вторая по популярности и капитализации валюта) - они не являются самостоятельными криптовалютами в классическом их понимании. Они являются крипто-токенами (tokens или assets) на базе блокчейна ethereum.
Список подобных токенов можно найти например здесь https://ethplorer.io, там же можно найти статистику по ним.

Нужны подобные токены обычно для следующего: какая-то компания хочет выпустить продукт, в котором нужна некая внутренняя валюта. Также эта компания хочет провести ICO (Initial Coin Offering), т.е. собрать денег на проект путём предварительной продажи токенов инвесторам. Так и появляются эти токены. Преимущества здесь прямо истекают из преимуществ блокчейна и смарт контрактов: прозрачность, защищенность и распределенность.

Например, посмотрим на одну из первых таких компаний Golem (https://golem.network).
Суть её заключается в следующем: когда нам понадобятся вычислительные мощности, мы можем идти не на Amazon (Azure, Google...), а арендовать компьютер у другого участника сети, расплатившись с ним GNT токенами. Соответственно, также можно сдать свой компьютер в аренду и получить некоторое количество GNT. Дальше эти токены можно либо тратить внутри сети, либо продать на бирже. Некоторые токены могут приносить дивиденды, либо давать права голоса на проводимых выборах о каких-либо вопросах связанных с продуктом компании (такое реализуется на смарт контрактах).
Golem, выпустив 1,000,000,000 токенов, смогли привлечь 820,000 ETH, что по текущему курсы составляет примерно $32,800,000, но во времена их ICO курс был раза в 3 хуже.

Сейчас я вам расскажу, как сделать свою подобную криптовалюту (tokens) на базе Ethereum.

В настоящий момент стандартом считается ERC20, описанный здесь https://github.com/ethereum/EIPs/issues/20

Интерфейс обычно выглядит примерно так:

```javascript
/*
 * ERC20 interface
 * see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) constant returns (uint);
  function transfer(address to, uint value);
  function allowance(address owner, address spender) constant returns (uint);

  function transferFrom(address from, address to, uint value);
  function approve(address spender, uint value);

  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}
```

А реализация примерно так:

```javascript
contract StandardToken is ERC20 {

  string public constant name = "Token Name";
  string public constant symbol = "TKN";
  uint8 public constant decimals = 18; 
  
  mapping (address => mapping (address => uint)) allowed;
  mapping (address => uint) balances;

  function transferFrom(address _from, address _to, uint _value) {
    var _allowance = allowed[_from][msg.sender];

    // Check is not needed because safeSub(_allowance, _value) will already throw if this condition is not met
    // if (_value > _allowance) throw;

    balances[_to] +=_value;
    balances[_from] -= _value;
    allowed[_from][msg.sender] -= _value;
    Transfer(_from, _to, _value);
  }

  function approve(address _spender, uint _value) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
  }

  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }

  function transfer(address _to, uint _value) {
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    Transfer(msg.sender, _to, _value);
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }
}
```
Разберем подробнее.

Это текущее количество выпущенных монет:
```javascript
uint public totalSupply;
```

Узнаём баланс по адресу:
```javascript
function balanceOf(address who) constant returns (uint);
```

Переводим свои токены кому-то другому:
```javascript
function transfer(address to, uint value);
```

Узнаём сколько монет нам разрешено потратить с чужого аккаунта. Управление этими разрешениями осуществляется функцией approve, описанной ниже:
```javascript
function allowance(address owner, address spender) constant returns (uint);
```

Переводим чужие, но доступные нам токены кому-то другому:
```javascript
function transferFrom(address from, address to, uint value);
```

Разрешаем кому-то пользоваться нашими токенами. Но остаются эти токены у нас. Нет ограничений на количество аккаунтов, которому будет разрешено использовать наши токены:
```javascript
function approve(address spender, uint value);
```

События о том, что кто-то перевел токены и о том, что кто-то разрешил пользоваться своими токенами:

```javascript
event Transfer(address indexed from, address indexed to, uint value);
event Approval(address indexed owner, address indexed spender, uint value);
```

Полное имя токена:
```javascript
string public constant name = "Token Name";
```

Краткое имя токена:
```javascript
string public constant symbol = "TKN";
```

Количество десятичных разрядов. В ETH их 18, но можно поставить другое число
```
uint8 public constant decimals = 18; 
```


Словарь адрес -> количество токенов:
```javascript
mapping (address => uint) balances;
```

Словарь доступных для распоряжения кому-то другому токенов:
```javascript
mapping (address => mapping (address => uint)) allowed;
```

Вот, в принципе и все. Но в данном виде смарт контракт бесполезен, т.к. сейчас не предусматривает создание токенов и их количество всегда будет равно нулю.
Добавим конструктор, который будет создавать 1,000,000 токенов и переводить их владельцу смарт контракта. Также не помешало бы все математичекие операции сопровождать проверками на переполнение, но здесь я это упущу.

```javascript
function StandardToken(){
  balances[msg.sender] = 1000000;
}
```

Не помешало бы и добавить функцию, которая позволит покупать токены. Для простоты будем чеканить токены по курсу 1 к 1, т.е. за 1 ETH будем начислять 1 наш токен.
Выглядеть она может например так:

```javascript
function mint() payable external {
  if (msg.value == 0) throw;

  var numTokens = msg.value;
  totalSupply += numTokens;

  balances[msg.sender] += numTokens;

  Transfer(0, msg.sender, numTokens);
}
```

Осталось это опубликовать в блокчейн. После этого можно будет пересылать эти токены на другие аккаунты.

Полезные ссылки по теме:
https://ethplorer.io
Статистика по токенам

https://www.icoalert.com  
Список активных и грядущих ICO