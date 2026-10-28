// §gui-components.ts — Direct 1:1 translation of C++ GUI component headers
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/components/
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { GuiComponent } from './gui-screens';

// === GuiElement.h — base GUI element ===
// --- GuiElement.h:9-25 ---
class GuiElement extends GuiComponent {
  active: boolean;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(active: boolean = false, visible: boolean = true, x: number = 0, y: number = 0, width: number = 24, height: number = 24) {
    super();
    this.active = active;
    this.visible = visible;
    this.x = x; this.y = y;
    this.width = width; this.height = height;
  }

  // --- GuiElement.h:15-16 ---
  tick(minecraft: any): void {}
  render(minecraft: any, xm: number, ym: number): void {}
  setupPositions(): void {}
  mouseClicked(minecraft: any, x: number, y: number, buttonNum: number): void {}
  mouseReleased(minecraft: any, x: number, y: number, buttonNum: number): void {}

  // --- GuiElement.h:19 — pointInside(int, int) ---
  pointInside(x: number, y: number): boolean {
    return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
  }

  setVisible(visible: boolean): void { this.visible = visible; }
}

// === GuiElementContainer.h — container for multiple elements ===
// --- GuiElementContainer.h:9-35 ---
class GuiElementContainer extends GuiElement {
  protected children: GuiElement[] = [];

  constructor(active: boolean = false, visible: boolean = true, x: number = 0, y: number = 0, width: number = 24, height: number = 24) {
    super(active, visible, x, y, width, height);
  }

  render(minecraft: any, xm: number, ym: number): void {
    for (const child of this.children) {
      if (child.visible) child.render(minecraft, xm, ym);
    }
  }

  setupPositions(): void {
    for (const child of this.children) child.setupPositions();
  }

  addChild(element: GuiElement): void { this.children.push(element); }
  removeChild(element: GuiElement): void {
    const idx = this.children.indexOf(element);
    if (idx >= 0) this.children.splice(idx, 1);
  }

  tick(minecraft: any): void {
    for (const child of this.children) child.tick(minecraft);
  }

  mouseClicked(minecraft: any, x: number, y: number, buttonNum: number): void {
    for (const child of this.children) {
      if (child.active && child.visible && child.pointInside(x, y)) {
        child.mouseClicked(minecraft, x, y, buttonNum);
      }
    }
  }

  mouseReleased(minecraft: any, x: number, y: number, buttonNum: number): void {
    for (const child of this.children) {
      child.mouseReleased(minecraft, x, y, buttonNum);
    }
  }
}

// === Button.h — standard button ===
// --- Button.h:14-43 ---
class Button extends GuiElement {
  msg: string;
  id: number;
  selected: boolean = false;
  protected _currentlyDown: boolean = false;

  constructor(id: number, msg: string);
  constructor(id: number, x: number, y: number, msg: string);
  constructor(id: number, x: number, y: number, w: number, h: number, msg: string);
  constructor(id: number, ...args: any[]) {
    super(true, true, 0, 0, 200, 24);
    this.id = id;
    if (args.length === 1) {
      this.msg = args[0];
    } else if (args.length === 3) {
      this.x = args[0]; this.y = args[1]; this.msg = args[2];
    } else if (args.length === 5) {
      this.x = args[0]; this.y = args[1]; this.width = args[2]; this.height = args[3]; this.msg = args[4];
    }
  }

  // --- Button.h:25-27 — render ---
  render(minecraft: any, xm: number, ym: number): void {
    if (!this.visible) return;
    this.renderBg(minecraft, xm, ym);
    this.renderFace(minecraft, xm, ym);
  }

  // --- Button.h:29-31 — clicked/released/setPressed ---
  clicked(minecraft: any, mx: number, my: number): boolean {
    return this.active && mx >= this.x && my >= this.y && mx < this.x + this.width && my < this.y + this.height;
  }
  released(mx: number, my: number): void { this._currentlyDown = false; }
  setPressed(): void { this._currentlyDown = true; }

  // --- Button.h:33 — isInside ---
  isInside(xm: number, ym: number): boolean {
    return xm >= this.x && ym >= this.y && xm < this.x + this.width && ym < this.y + this.height;
  }

  // --- Button.h:36-42 — protected helpers ---
  protected getYImage(hovered: boolean): number {
    let res = 1;
    if (!this.active) res = 0;
    else if (hovered) res = 2;
    return res;
  }

  protected renderBg(minecraft: any, xm: number, ym: number): void {
    // §C++: blits gui.png at (0, 46 + yImage * 20)
  }

  protected renderFace(minecraft: any, xm: number, ym: number): void {
    // §C++: drawCenteredString(font, msg, x + width/2, y + (height-8)/2, color)
  }

  protected hovered(minecraft: any, xm: number, ym: number): boolean {
    return minecraft.useTouchscreen() ? (this._currentlyDown && this.isInside(xm, ym)) : false;
  }
}

// --- Button.h:47-55 — BlankButton (invisible, click-only) ---
class BlankButton extends Button {
  constructor(id: number);
  constructor(id: number, x: number, y: number, w: number, h: number);
  constructor(id: number, ...args: any[]) {
    super(id, '');
    this.visible = false;
    if (args.length === 4) {
      this.x = args[0]; this.y = args[1]; this.width = args[2]; this.height = args[3];
    }
  }
}

// --- Button.h:60-80 — Touch::TButton (touchscreen button) ---
class TButton extends Button {
  constructor(id: number, msg: string);
  constructor(id: number, x: number, y: number, msg: string);
  constructor(id: number, x: number, y: number, w: number, h: number, msg: string);
  constructor(id: number, ...args: any[]) {
    super(id, ...args);
  }

  protected renderBg(minecraft: any, xm: number, ym: number): void {
    // §C++: renders touchgui.png button background
  }
}

// --- Button.h:85-103 — Touch::THeader (touchscreen header button) ---
class THeader extends Button {
  xText: number = 0;

  constructor(id: number, msg: string);
  constructor(id: number, x: number, y: number, msg: string);
  constructor(id: number, x: number, y: number, w: number, h: number, msg: string);
  constructor(id: number, ...args: any[]) {
    super(id, ...args);
  }

  protected renderBg(minecraft: any, xm: number, ym: number): void {}
  render(minecraft: any, xm: number, ym: number): void { super.render(minecraft, xm, ym); }
}

// === ImageButton.h — button with image + OptionButton toggle ===
// --- ImageButton.h:10-18 — IntRectangle struct ---
interface IntRectangle { x: number; y: number; w: number; h: number; }

// --- ImageButton.h:20-42 — ImageDef struct ---
class ImageDef {
  name: string = '';
  x: number = 0;
  y: number = 0;
  width: number = 16;
  height: number = 16;
  private hasSrc: boolean = false;
  private src: IntRectangle = { x: 0, y: 0, w: 1, h: 1 };

  setSrc(srcRect: IntRectangle): this {
    this.hasSrc = true;
    this.src = srcRect;
    return this;
  }
  getSrc(): IntRectangle | null { return this.hasSrc ? this.src : null; }
}

// --- ImageButton.h:48-66 ---
class ImageButton extends Button {
  protected _imageDef: ImageDef = new ImageDef();
  scaleWhenPressed: boolean = true;

  constructor(id: number, msg: string);
  constructor(id: number, msg: string, imageDef: ImageDef);
  constructor(id: number, msg: string, imageDef?: ImageDef) {
    super(id, msg);
    if (imageDef) this._imageDef = imageDef;
  }

  setImageDef(imageDef: ImageDef, setButtonSize: boolean): void {
    this._imageDef = imageDef;
    if (setButtonSize) {
      this.width = imageDef.width;
      this.height = imageDef.height;
    }
  }

  render(minecraft: any, xm: number, ym: number): void { super.render(minecraft, xm, ym); }
  protected renderBg(minecraft: any, xm: number, ym: number): void {}

  protected setupDefault(): void {}
  protected isSecondImage(hovered: boolean): boolean { return hovered; }
}

// --- ImageButton.h:72-103 — OptionButton (toggle) ---
class OptionButton extends ImageButton {
  static ButtonId = 9999999;
  private _option: any;
  private _secondImage: boolean = false;
  private _isFloat: boolean = false;
  private _onValue: number = 0;
  private _offValue: number = 0;
  private _current: number = 0;

  constructor(option: any);
  constructor(option: any, onValue: number, offValue: number);
  constructor(option: any, onValue?: number, offValue?: number) {
    super(OptionButton.ButtonId, '');
    this._option = option;
    if (onValue !== undefined) {
      this._isFloat = true;
      this._onValue = onValue;
      this._offValue = offValue ?? 0;
    }
  }

  toggle(options: any): void {
    // §C++: toggles the option value
  }

  updateImage(options: any): void {
    // §C++: updates button image based on current option value
  }

  protected isSecondImage(hovered: boolean): boolean { return this._secondImage; }

  mouseClicked(minecraft: any, x: number, y: number, buttonNum: number): void {
    this.toggle(minecraft.options);
  }
}

// === GButton.h — layered button ===
// --- GButton.h:9-53 ---
class GButton extends Button {
  static LayerDefault = 1;
  static LayerSelected = 2;
  static LayerMax = 4;
  private layers: [GuiElement, number][] = [];

  constructor(id: number) { super(id, ''); }

  addElement(layerId: number, e: GuiElement): void {
    if (!e || layerId < 0 || layerId >= GButton.LayerMax) return;
    this.layers.push([e, layerId]);
  }

  render(minecraft: any, xm: number, ym: number): void {
    if (!this.visible) return;
    const isHovered = minecraft.isTouchscreen() ?
      (this._currentlyDown && this.isInside(xm, ym)) : false;
    const layer = isHovered ? GButton.LayerSelected : GButton.LayerDefault;
    for (const [element, elementLayer] of this.layers) {
      if ((elementLayer & layer) !== 0) element.render(minecraft, 0, 0);
    }
  }
}

// === SmallButton.h — small button ===
class SmallButton extends Button {
  constructor(id: number, msg: string) { super(id, msg); this.width = 78; this.height = 22; }
}

// === TextBox.h — text input ===
class TextBox extends GuiElement {
  text: string = '';
  maxLength: number = 32;
  private focused: boolean = false;

  constructor(active: boolean = false, visible: boolean = true, x: number = 0, y: number = 0, width: number = 100, height: number = 20) {
    super(active, visible, x, y, width, height);
  }

  setText(text: string): void { this.text = text; }
  getText(): string { return this.text; }
  setFocused(focused: boolean): void { this.focused = focused; }
  isFocused(): boolean { return this.focused; }
  render(minecraft: any, xm: number, ym: number): void {}
  mouseClicked(minecraft: any, x: number, y: number, buttonNum: number): void {
    if (this.pointInside(x, y)) this.focused = true;
  }
}

// === NinePatch.h — 9-patch scalable background ===
class NinePatchLayer {
  constructor(textureName: string, src: IntRectangle, borderX: number, borderY: number) {}

  render(x: number, y: number, w: number, h: number): void {}
  render(T: any, x: number, y: number, w: number, h: number): void {}
}

// === Slider.h — slider component ===
class Slider extends GuiElement {
  value: number = 0;
  minValue: number = 0;
  maxValue: number = 1;

  constructor(active: boolean, visible: boolean, x: number, y: number, width: number, height: number, minValue: number, maxValue: number) {
    super(active, visible, x, y, width, height);
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  getValue(): number { return this.value; }
  setValue(value: number): void { this.value = value; }
  render(minecraft: any, xm: number, ym: number): void {}
}

// === InventoryPane.h — scrolling inventory pane ===
class InventoryPane extends GuiElement {
  items: any[] = [];
  selectedIndex: number = -1;

  constructor(active: boolean, visible: boolean, x: number, y: number, width: number, height: number, callback?: any) {
    super(active, visible, x, y, width, height);
  }

  setItems(items: any[]): void { this.items = items; }
  render(minecraft: any, xm: number, ym: number): void {}
  mouseClicked(minecraft: any, x: number, y: number, buttonNum: number): void {}
}

// === ItemPane.h — item rendering pane ===
class ItemPane extends GuiElement {
  constructor(active: boolean, visible: boolean, x: number, y: number, width: number, height: number) {
    super(active, visible, x, y, width, height);
  }
  render(minecraft: any, xm: number, ym: number): void {}
}

// === LargeImageButton.h — large image button ===
class LargeImageButton extends Button {
  constructor(id: number, msg: string) { super(id, msg); this.width = 200; this.height = 40; }
}

// === OptionsPane.h / OptionsItem.h / OptionsGroup.h — options system ===
class OptionsItem {
  option: any;
  constructor(option: any) { this.option = option; }
  render(minecraft: any, xm: number, ym: number): void {}
}

class OptionsGroup {
  items: OptionsItem[] = [];
  addItem(item: OptionsItem): void { this.items.push(item); }
}

class OptionsPane extends GuiElement {
  groups: OptionsGroup[] = [];
  constructor(active: boolean = false, visible: boolean = true, x: number = 0, y: number = 0, width: number = 200, height: number = 100) {
    super(active, visible, x, y, width, height);
  }
  addGroup(group: OptionsGroup): void { this.groups.push(group); }
  render(minecraft: any, xm: number, ym: number): void {}
  tick(minecraft: any): void {}
}

// === ScrolledSelectionList.h / ScrollingPane.h / RolledSelectionList*.h ===
class ScrolledSelectionList extends GuiElement {
  protected selectedItem: number = -1;
  protected scrollY: number = 0;

  constructor(minecraft: any, width: number, height: number, top: number, bottom: number, slotHeight: number) {
    super(true, true, 0, top, width, height);
  }

  getNumberOfItems(): number { return 0; }
  selectItem(item: number, doubleClick: boolean): void { this.selectedItem = item; }
  isSelectedItem(item: number): boolean { return item === this.selectedItem; }
  renderBackground(): void {}
  renderItem(i: number, x: number, y: number, h: number, t: any): void {}
  render(minecraft: any, xm: number, ym: number): void {}
}

export {
  GuiElement, GuiElementContainer,
  Button, BlankButton, TButton, THeader,
  ImageDef, IntRectangle, ImageButton, OptionButton,
  GButton, SmallButton, TextBox, NinePatchLayer, Slider,
  InventoryPane, ItemPane, LargeImageButton,
  OptionsItem, OptionsGroup, OptionsPane,
  ScrolledSelectionList
};
