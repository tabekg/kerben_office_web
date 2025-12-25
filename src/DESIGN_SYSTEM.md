# Kerben Design System

Дизайн-система для панели управления логистической компании Kerben.

## 📁 Структура

```
src/
├── theme/                    # Дизайн-токены
│   ├── colors.ts            # Цветовая палитра
│   ├── spacing.ts           # Система отступов
│   ├── typography.ts        # Типографика
│   ├── borders.ts           # Радиусы и границы
│   ├── shadows.ts           # Тени
│   ├── transitions.ts       # Анимации
│   ├── zIndex.ts            # Z-индексы
│   ├── breakpoints.ts       # Брейкпоинты
│   ├── variables.css        # CSS переменные
│   └── index.ts             # Главный экспорт
│
└── components/
    └── ui/                   # UI компоненты
        ├── Button/
        ├── Card/
        ├── Badge/
        ├── Input/
        ├── Modal/
        ├── Spinner/
        ├── StatusIndicator/
        └── index.ts
```

## 🎨 Цвета

### Использование CSS переменных

```css
.my-element {
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-default);
}

/* Статусы */
.online { color: var(--color-status-online); }
.offline { color: var(--color-status-offline); }
.pending { color: var(--color-status-pending); }
```

### Использование в TypeScript

```tsx
import { colors } from '@/theme'

const style = {
  backgroundColor: colors.primary[500],
  color: colors.text.primary,
}
```

## 📐 Отступы

```css
/* CSS переменные */
padding: var(--spacing-4);      /* 16px */
margin: var(--spacing-2);       /* 8px */
gap: var(--spacing-3);          /* 12px */
```

### Шкала отступов

| Переменная | Значение |
|------------|----------|
| `--spacing-1` | 4px |
| `--spacing-2` | 8px |
| `--spacing-3` | 12px |
| `--spacing-4` | 16px |
| `--spacing-6` | 24px |
| `--spacing-8` | 32px |

## 🔤 Типографика

```css
/* Размеры шрифта */
font-size: var(--font-size-sm);   /* 14px */
font-size: var(--font-size-base); /* 16px */
font-size: var(--font-size-lg);   /* 18px */
font-size: var(--font-size-xl);   /* 20px */

/* Насыщенность */
font-weight: var(--font-weight-normal);   /* 400 */
font-weight: var(--font-weight-medium);   /* 500 */
font-weight: var(--font-weight-semibold); /* 600 */
font-weight: var(--font-weight-bold);     /* 700 */
```

## 🧩 Компоненты

### Button

```tsx
import { Button } from '@/components/ui'

// Варианты
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>

// Размеры
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Состояния
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// С иконками
<Button leftIcon={<Icon />}>With Icon</Button>
<Button rightIcon={<Icon />}>With Icon</Button>
<Button iconOnly><Icon /></Button>
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui'

<Card variant="default">
  <CardHeader 
    title="Заголовок" 
    subtitle="Подзаголовок"
    action={<Button size="sm">Action</Button>}
  />
  <CardBody>
    Контент карточки
  </CardBody>
  <CardFooter align="between">
    <Button variant="ghost">Отмена</Button>
    <Button>Сохранить</Button>
  </CardFooter>
</Card>

// Кликабельная карточка
<Card clickable onClick={() => {}}>
  ...
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui'

// Варианты
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Успех</Badge>
<Badge variant="warning">Внимание</Badge>
<Badge variant="danger">Ошибка</Badge>
<Badge variant="online">Онлайн</Badge>
<Badge variant="offline">Оффлайн</Badge>

// Стиль пилюли
<Badge pill>Pill Badge</Badge>

// Точка статуса
<Badge variant="online" dot />
```

### Input

```tsx
import { Input } from '@/components/ui'

<Input 
  label="Email"
  placeholder="example@email.com"
  hint="Введите рабочий email"
/>

<Input 
  label="Пароль"
  type="password"
  error="Пароль слишком короткий"
/>

<Input 
  leftIcon={<SearchIcon />}
  placeholder="Поиск..."
/>
```

### Modal

```tsx
import { Modal, Button } from '@/components/ui'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Заголовок модального окна"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Отмена
      </Button>
      <Button onClick={handleSave}>
        Сохранить
      </Button>
    </>
  }
>
  Контент модального окна
</Modal>
```

### StatusIndicator

```tsx
import { StatusIndicator } from '@/components/ui'

<StatusIndicator status="online" pulse />
<StatusIndicator status="offline" />
<StatusIndicator status="pending" />
<StatusIndicator status="on-way" icon={<TruckIcon />} />
<StatusIndicator status="completed" />
```

### Spinner

```tsx
import { Spinner } from '@/components/ui'

<Spinner size="sm" />
<Spinner size="md" variant="primary" />
<Spinner size="lg" variant="white" />
```

## 🎯 Миграция

### Замена inline стилей

**Было:**
```tsx
<div style={{
  padding: 12,
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
}}>
```

**Стало:**
```css
/* Component.module.css */
.item {
  padding: var(--spacing-3);
  background-color: var(--color-bg-hover);
  cursor: pointer;
}
```

### Замена Bootstrap компонентов

**Было:**
```tsx
import { Button } from 'react-bootstrap'

<Button variant="primary">Click</Button>
<Button variant="danger">Delete</Button>
```

**Стало:**
```tsx
import { Button } from '@/components/ui'

<Button variant="primary">Click</Button>
<Button variant="danger">Delete</Button>
```

## 📝 Правила

1. **Никогда не используйте inline стили** — используйте CSS Modules
2. **Используйте CSS переменные** вместо хардкода цветов
3. **Используйте семантические цвета** (`--color-text-primary`) вместо прямых (`--color-neutral-900`)
4. **Используйте UI компоненты** вместо Bootstrap
5. **Следуйте шкале отступов** — не используйте произвольные значения
