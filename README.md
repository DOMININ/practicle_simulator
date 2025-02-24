# Поиск проблем производительности

Это приложение по симуляции движения физических частиц на основе их базовых свойств (скорость, масса, заряд)

```
pnpm i
pnpm run dev
```

![example](https://github.com/trof808/practicle_simulator/blob/main/demo.gif)

## Примечание

В решении можно использовать AI, но не просить его напрямую решить задачу. Для начала стоит подумать самому, изучить соответствующие статьи и тд. Пример, как можно строить вопросы

1. У меня есть такой-то алгоритм, какие есть способы его оптимизации. Объясни, но не пиши реализацию. Он предложит тебе разные варианты, твоя задача попробовать их реализовать в коде
2. Как в javascript может возикнуть утечка памяти? изучаешь, читаешь, пробуешь найти
3. Как работает основной поток в javascript? В каких случая он может заблокироваться?

При этом каждый ответ, скорее всего породит новый вопрос, который ты можешь задать. Не ограничивайся только задачей, можно изучать вширь

## 1. Решить проблему частоты обновления рендера

Первая проблема, которую необходимо решить это корректность отрисовки частиц. Сейчас наблюдается явная проблема отрисовки
на каждой итерации. Пока это не связано с проблемой производительности, а больше с частотой обновления кадров

Необходимо найти источник проблемы и исправить его. Как итог все частицы должны двигаться плавно без моргания

https://developer.mozilla.org/ru/docs/Web/Performance/Animation_performance_and_frame_rate
https://developer.mozilla.org/ru/docs/Web/API/Window/requestAnimationFrame
https://devtoolstips.org/tips/en/display-current-framerate/

## 2. Решить проблему перерисовки на большом количестве элементов

Если увеличить количество элементов на странице, то производительность рендера упадет, частицы начнут двигаться с задержкой. Также ухудшиться взаимодействие с интерфейсом, нажатие на кнопки и ввод в инпут будет происходить также с задержкой

Необходимо произвести анализ с помощью devtools, найти источник проблемы и придумать решение

Чтобы было проще, стоит обратить внимание на вопрос, **"почему с ростом количества элементов падает производительности?"**

Тут есть два пути, можно оба реализовать. Либо оптимизировать алгоритм пересчета. Либо освободить основной поток от тяжелых операций, чтобы ускорить рендеринг

https://developer.chrome.com/docs/devtools/performance?hl=ru

## 3. Найти утечку памяти

По истечении времени, если просто ничего не делать то производительность все равно начнет падать. Это также будет заметно, когда частицы начнут двигаться с задержкой. Необходимо найти источник проблемы. Скорее всего это связано с утечкой памяти

Нужно явно определить с помощью инструментов разработки, что утечка памяти присутствует и найти ее источник. Тут важно научиться делать это с помощью devtools браузера

https://learn.javascript.ru/memory-leaks
https://developer.mozilla.org/ru/docs/Web/JavaScript/Memory_management
https://developer.chrome.com/docs/devtools/memory-problems?hl=ru
https://developer.chrome.com/docs/devtools/performance?hl=ru
