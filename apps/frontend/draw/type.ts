export type Shape =
    | {
          type: "rectangle";
          x: number;
          y: number;
          width: number;
          height: number;
          color?: string;
          clientId?: string;
      }
    | {
          type: "circle";
          x: number;
          y: number;
          radius: number;
          color?: string;
          clientId?: string;
      }
    | {
          type: "line";
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          color?: string;
          clientId?: string;
      }
      | {
        type: "pencil";
        points: { x: number; y: number }[];
        color?: string;
        clientId?: string;
      }
    | {
        type: "text";
        x: number;
        y: number;
        text: string;
        fontSize?: number;
        color?: string;
        clientId?: string;
      }
      | {
        type: "image";
        x: number;
        y: number;
        width: number;
        height: number;
        src: string;
      }
    | {
          type: "select";
      };

export type Tool =
    | "rectangle"
    | "circle"
    | "line"
    | "hand"
    | "select"
    | "eraser"
    | "pencil"
    | "text"
    | "paste"; 