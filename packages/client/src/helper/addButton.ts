import { GameObj, Vec2 } from "kaboom";
import { k } from "../App";

export function addButton(txt: string, position: Vec2, tag: string, f: (bg: GameObj, text: GameObj) => void) {
    const bg = k.add([
        k.pos(position),
        k.rect(k.width() / 2, 64),
        k.anchor("center"),
        k.color(1, 1, 1),
        k.area(),
        tag
    ]);

    const text = k.add([
        k.text(txt),
        k.pos(position),			
        k.anchor("center"),
        k.color(k.WHITE),
        tag
    ]);

    bg.onHover(() => {
        bg.color = k.YELLOW;
        text.color = k.BLACK;
        k.setCursor("pointer");
        tag
    });

    bg.onHoverEnd(() => {
        bg.color = k.MAGENTA;
        text.color = k.WHITE;
        k.setCursor("auto");
        tag
    })

    bg.onClick(() => {
        f(bg, text);
    })
}