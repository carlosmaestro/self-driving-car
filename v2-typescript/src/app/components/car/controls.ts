import { CarControlType } from "../../enums/car-control-type.enum";
import { CarControlsKeys } from "../../enums/car-control.enum";

export class ICarControls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
  break: boolean;
}

export class CarControls implements ICarControls {

  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
  break: boolean;


  constructor(controlType: CarControlType) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    this.break = false;

    switch (controlType) {
      case CarControlType.KEYS:
        this.addKeyboardListeners();
        break;
      case CarControlType.DUMMY:
        this.forward = true;
        break;
      default:
        break;
    }
  }

  private addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.code) {
        case CarControlsKeys.LEFT:
          this.left = true;
          break;
        case CarControlsKeys.RIGHT:
          this.right = true;
          break;
        case CarControlsKeys.FORWARD:
          this.forward = true;
          break;
        case CarControlsKeys.REVERSE:
          this.reverse = true;
          break
        case CarControlsKeys.BREAK:
          this.break = true;
          break
        default:
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.code) {
        case CarControlsKeys.LEFT:
          this.left = false;
          break;
        case CarControlsKeys.RIGHT:
          this.right = false;
          break;
        case CarControlsKeys.FORWARD:
          this.forward = false;
          break;
        case CarControlsKeys.REVERSE:
          this.reverse = false;
          break
        case CarControlsKeys.BREAK:
          this.break = false;
          break
        default:
          break;
      }
    };
  }
}