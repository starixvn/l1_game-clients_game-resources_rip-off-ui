import { array, generateArrayParser } from "./array";
import { ccclass } from "./ccclass";
import { customClass } from "./custom-class";
import { dictionary } from "./dictionary";
import { innerObject } from "./inner-object";
import { instanceReference } from "./instance-reference";
import { simple } from "./simple";
import { trs } from "./trs";
import { valueType, valueTypeCreated } from "./value-type";

export function getParser(type: number) {
  const parsers = [
    simple,
    instanceReference,
    generateArrayParser(instanceReference),
    generateArrayParser(innerObject),
    ccclass,
    valueTypeCreated,
    innerObject,
    trs,
    valueType,
    generateArrayParser(ccclass),
    customClass,
    dictionary,
    array,
  ];
  return parsers[type] ?? simple;
}
