'use client';

/// <reference path="../types/animejs.d.ts" />
import { useEffect, useRef, useCallback } from 'react';

type AnimeParams = Record<string, any>;

/**
 * Returns a stable `play` function that runs an Anime.js animation.
 * The timeline is automatically paused & reversed on cleanup.
 */
export function useAnime() {
  const animeRef = useRef<any>(null);

  const play = useCallback(async (params: AnimeParams) => {
    const anime = (await import('animejs')).default;
    if (animeRef.current) {
      animeRef.current.pause();
    }
    animeRef.current = anime({ ...params, autoplay: true });
    return animeRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (animeRef.current) {
        animeRef.current.pause();
        animeRef.current = null;
      }
    };
  }, []);

  return { play };
}

/**
 * Anime.js counter — animates a number from 0 → target when `inView` becomes true.
 * Returns a ref to attach to the DOM element that displays the number.
 */
export function useAnimeCounter(target: number, suffix = '', inView = false) {
  const elRef = useRef<HTMLElement>(null);
  const lastAnimatedTarget = useRef<number | null>(null);

  useEffect(() => {
    if (!inView || !elRef.current || target === 0) return;
    if (lastAnimatedTarget.current === target) return;
    lastAnimatedTarget.current = target;

    const runCounter = async () => {
      const anime = (await import('animejs')).default;
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: target,
        round: 1,
        duration: 1400,
        easing: 'easeOutExpo',
        update: () => {
          if (elRef.current) {
            elRef.current.textContent = `${Math.round(obj.val)}${suffix}`;
          }
        },
      });
    };
    runCounter();
  }, [inView, target, suffix]);

  return elRef;
}

/**
 * Anime.js shimmer — runs a horizontal gradient sweep across an element on hover.
 * Returns { onMouseEnter, onMouseLeave } handlers.
 */
export function useAnimeShimmer() {
  const play = useCallback(async (el: HTMLElement | null) => {
    if (!el) return;
    const anime = (await import('animejs')).default;
    anime({
      targets: el,
      backgroundPosition: ['200% center', '-200% center'],
      duration: 700,
      easing: 'easeInOutQuad',
    });
  }, []);

  return { triggerShimmer: play };
}
