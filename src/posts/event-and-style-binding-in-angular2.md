Angular 2 introduces new template syntax and directives that allow us to manipulate data in our applications. In this post, I begin with a brief introduction on data and event binding then dive right in to using style and class binding as well as directives to dynamically apply CSS and CSS classes.

# One-way data binding

In Angular, data binding describes the **synchronization between model and view**. To explain this simply, assume we have a simple expression in our template.

```html
<h1>{{firstname}}</h1>
```

Whenever the expression `{{firstname}}` changes, we want the DOM to update. The processes that trigger this instant update of the DOM is known as **data binding** and **one-way** refers to the directional flow of data from model to view.

# Two-way data binding

Two-way data binding explains how the view updates when the model changes **and vice-versa**. This happens immediately which means that the model and view are always in-sync. In other words, you can think of the view as an instant projection of the model.

Lets look at a simple example of how this works.

```html
<h1>{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
```

```javascript
export class MyApp {
  firstname: string = 'Jimmy';
}
```

We can see that the HTML is similar to what you would see in Angular 1.x. However, the two way binding syntax, `[(ngModel)]`, is slightly different.

Just as you would expect, changing the input value changes the interpolation `{{firstname}}` which is evidence that the value is flowing to the model and vice-versa.

# Event Binding

Now let's add a click event to make things a little more exciting.

```html
<h1>{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
```

```javascript
export class MyApp {
  firstname: string = 'Jimmy';

  changeName() {
    this.firstname = 'Houssein';
  }
}
```

The syntax is simple. The **target event** `(click)` is in parentheses and the response to the event `changeName()` is to the right of it. The notation of having events within parentheses is new in Angular 2, where in Angular 1.x this would have looked like `ng-click="changeName()"`.

# Style Binding

Angular 2 allows us to conditionally add styles to an element with a few different ways, and one of them is by **style binding**.

```html
<h1 [style.color]="isHoussein() ? 'red': 'black'">{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
```

```javascript
export class MyApp {
  firstname: string = 'Jimmy';

  changeName() {
    this.firstname = 'Houssein';
  }

  isHoussein() {
    return this.firstname === 'Houssein';
  }
}
```

Again, the syntax is straightforward where `style` is preceded by the name of a CSS style property: `[style.color]`. In this example, the color style property binds to the template expression, `isHoussein()`. With this code example copied in your project, rry changing the name to _Houssein_ through the input field or by clicking the button.

Now what if we wanted to set multiple inline styles? That's where the `ngStyle` directive comes in. With this, we can have multiple style properties each connected to their own condition through a key:value object.

```html
<h1 [ngStyle]="setStyles()">{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
```

```javascript
export class App {
  firstname: string = 'Jimmy';

  changeName() {
    this.firstname = this.alternate ? 'Daniel' : 'Houssein';
    this.alternate = !this.alternate;
  }

  isHoussein() {
    return this.firstname === 'Houssein';
  }

  isDaniel() {
    return this.firstname === 'Daniel';
  }

  setStyles() {
    let styles = {
      color: this.isHoussein() ? 'red' : 'black',
      'font-size': this.isDaniel() ? '3em' : '2em',
      'font-style': this.isDaniel() || this.isHoussein() ? 'italic' : 'normal',
    };
    return styles;
  }
}
```

# Class Binding

Similar to style binding, **class binding** allows you to add or remove classes based on variables or expressions.

Here's an example of adding a conditional-based class.

```html
<h1 [class.awesome]="isHoussein()">{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
```

```css
.awesome {
  color: red;
}
```

```javascript
export class MyApp {
  firstname: string = 'Jimmy';

  changeName() {
    this.firstname = 'Houssein';
  }

  isHoussein() {
    return this.firstname === 'Houssein';
  }
}
```

With this approach, `[class.awesome]` binds to the specific `.awesome` class when the template expression, `isHoussein()`, is truthy.

Now let's see how we can use the `ngClass` directive to add multiple classes at the same time.

```html
<h1 [ngClass]="setClasses()">{{firstname}}</h1>
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
```

```css
.italic {
  font-style: italic;
}

.awesome {
  color: red;
}

.move {
  position: relative;
  animation: move 1s infinite;
  animation-duration: 3s;
}

@keyframes move {
  0% {
    left: 0px;
  }
  50% {
    left: 200px;
  }
  100% {
    left: 0px;
  }
}
```

```javascript
export class App {
  firstname: string = 'Jimmy';
  alternate: boolean = false;

  changeName() {
    this.firstname = this.alternate ? 'Daniel' : 'Houssein';
    this.alternate = !this.alternate;
  }

  isHoussein() {
    return this.firstname === 'Houssein';
  }

  isDaniel() {
    return this.firstname === 'Daniel';
  }

  setClasses() {
    let classes = {
      awesome: this.isHoussein(),
      move: this.isDaniel(),
      italic: this.isHoussein() || this.isDaniel(),
    };
    return classes;
  }
}
```

# Wrapping things up

In this post, I covered the basics of one-way and two-way data binding as well as showed how you can manipulate style properties and classes with a few different ways. Hope it proved useful and stay tuned for my next post on Angular 2 <i class="fa fa-smile-o" aria-hidden="true"></i>
.
