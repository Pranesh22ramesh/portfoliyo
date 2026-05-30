declare module 'animejs' {
  interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number | ((el: any, i: number, total: number) => number);
    easing?: string;
    loop?: boolean | number;
    direction?: 'normal' | 'reverse' | 'alternate';
    autoplay?: boolean;
    update?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    [property: string]: any;
  }

  interface AnimeInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    reverse: () => void;
    seek: (time: number) => void;
    duration: number;
    currentTime: number;
    progress: number;
    paused: boolean;
    completed: boolean;
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance;
    timeline(params?: AnimeParams): AnimeInstance & { add: (params: AnimeParams) => AnimeInstance };
    stagger(value: number | string, options?: Record<string, any>): (el: any, i: number, total: number) => number;
    set(targets: any, properties: Record<string, any>): void;
    get(targets: any, prop: string, unit?: string): string | number;
    remove(targets: any): void;
    random(min: number, max: number): number;
    running: AnimeInstance[];
    easings: Record<string, (t: number) => number>;
  }

  const anime: AnimeStatic;
  export = anime;
  export default anime;
}
