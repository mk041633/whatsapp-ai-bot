    export const getHelloMessage = () => {
        const variants = [
        getMessageByHour(),
        "Здравствуйте",
        "Привет",
        "Приветствую",
        ];
    
        const index = parseInt((Math.random() * variants.length).toString());
    
        if (index >= variants.length) {
        return variants[0];
        }
    
        return variants[index];
  };
  
  const getMessageByHour = () => {
    const arr = ["Доброе утро", "Добрый день", "Добрый вечер"];
  
    const currentHour = new Date().getHours();
  
    if (currentHour >= 8 && currentHour <= 12) {
      return arr[0];
    } else if (currentHour > 12 && currentHour <= 16) {
      return arr[1];
    } else {
      return arr[2];
    }
  };
  
  export const getManagerName = () => {
    const managers = ["Бакытжан", "Cымбат", "Айжан"];
  
    const index = parseInt((Math.random() * managers.length).toString());
  
    if (index >= managers.length) {
      return managers[0];
    }
  
    return managers[index];
  };
  
  export const getKaspiName = () => {
    const names = ["Kaspi", "kaspi", "Каспи", "kaspi", "Kaspi kz", "Каспи kz"];
  
    const index = parseInt((Math.random() * names.length).toString());
  
    if (index >= names.length) {
      return names[0];
    }
  
    return names[index];
  };
  
  export const getSignAfterHelloMessage = () => {
    const signs = ["!", ".", ",", "!)", ")", ":)", " "];
  
    const index = parseInt((Math.random() * signs.length).toString());
  
    if (index >= signs.length) {
      return signs[0];
    }
  
    return signs[index];
  };
  
  export const getSmile = () => {
    const variants = ["", " 👋", " 😊"];
  
    const index = parseInt((Math.random() * variants.length).toString());
  
    if (index >= variants.length) {
      return variants[0];
    }
  
    return variants[index];
  };
  
  export const getPerformance = () => {
    const variants = ["Меня зовут", "Я", "Вас приветствует"];
  
    const index = parseInt((Math.random() * variants.length).toString());
  
    if (index >= variants.length) {
      return variants[0];
    }
  
    return variants[index];
  };
  
  export const firstMessages = () => {
  
    return [
      `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}.`,
      `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}.`,
      `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}.`,
    ];
  };
  
  export const middleMessagesWithStoreName = (storeName = "") => {
    if (!storeName) {
      return [];
    }
  
    return [
      `Это магазин ${storeName}?`,
      `${storeName}?`,
      `${storeName} - это ваш магазин?`,
    ];
  };
/*
  export const getRandomFirstMessage = (storeName = "") => {
    const firstMessages = [
      `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}. У вас есть магазин на ${getKaspiName()}?`,
      // `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}. У вас есть ${getKaspiName()} магазин?`,
      // `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}. Вижу вы продаете на ${getKaspiName()}?`,
      `${getHelloMessage()}${getSmile()}${getSignAfterHelloMessage()} ${getPerformance()} ${getManagerName()}. Продаете на ${getKaspiName()}?`,
    ];
  
    const availableMessages = firstMessages.concat(
      firstMessages()
    );
  
    const index = parseInt((Math.random() * availableMessages.length).toString());
  
    let message = availableMessages[index];
    if (!message) {
      message = availableMessages[0];
    }
  
    return message;
  };
  */
  export const linkMessages = () => {
    return [
      `Хотите увеличить продажи на ${getKaspiName}? 
  С помощью вы можете быть первыми среди продавцов, предлагая наиболее выгодные цены на товары. Наша система постоянно отслеживает цены на сайте Kaspi и помогает вам быть конкурентоспособными. 
  Попробуйте уже сегодня и увеличьте ваши продажи на ${getKaspiName()}!
  
  ${getRandomSalescoutLink()}
  `,
      `Сервис автоматического обновления цен на каспи – это идеальное решение для тех, кто хочет всегда быть в курсе последних ценовых изменений и не тратить много времени на ручное обновление прайс-листа. С нашим сервисом вы можете настроить автоматическое обновление цен в режиме реального времени, что позволит вам сохранять конкурентные цены и привлекать больше покупателей. 
  Попробуйте наш сервис уже сегодня и ощутите все преимущества автоматизации!
  
  ${getRandomSalescoutLink()}
  `,
      `Хотите всегда быть в курсе последних ценовых изменений и при этом не тратить много времени на ручное обновление прайс-листа? Тогда наш сервис автоматического обновления цен на каспи – это именно то, что вам нужно! С нами вы можете быть уверены в том, что ваши цены всегда конкурентоспособны и позволят вам привлекать больше покупателей. 
  Попробуйте наш сервис уже сегодня и ощутите всю мощь автоматизации!
  
  ${getRandomSalescoutLink()}`,
    ];
  };
  
  const getRandomSalescoutLink = () => {
    const variants: string[] = [
      "https://rb.gy/4il9wy",
      "https://t.ly/oQasX",
      "https://tinyurl.com/2p8j3ade",
      "http://bit.ly/3jilWJp",
    ];
    const labelVariants = ["Ссылка", "Вот ссылка"];
  
    const index = parseInt((Math.random() * variants.length).toString());
    const i = parseInt((Math.random() * labelVariants.length).toString());
  
    let message = variants[index];
    if (!message) {
      message = variants[0];
    }
  
    let label = labelVariants[i];
    if (!label) {
      label = labelVariants[0];
    }
  
    return `${label}: ${
      Math.floor(Math.random() * 2) === 1 ? "\n" : ""
    }${message}`;
  };
  