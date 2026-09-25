import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react';
import * as Tone from 'tone';

const PIANO_URLS = { A3: 'A3.wav', A4: 'A4.wav', A5: 'A5.wav' };

const AudioContextReact = createContext<{
  getPiano: () => Tone.Sampler | undefined;
  loaded: boolean;
  resetAudioIfNeeded: () => Promise<void>;
}>({
  getPiano: () => undefined,
  loaded: false,
  resetAudioIfNeeded: async () => {},
});

const loadSampler = () =>
  new Promise<Tone.Sampler>((resolve) => {
    const sampler = new Tone.Sampler({
      urls: PIANO_URLS,
      onload: () => resolve(sampler),
      baseUrl: '/',
    }).toDestination();
  });

export function AudioProvider({ children }: PropsWithChildren) {
  const pianoRef = useRef<Tone.Sampler | null>(null);
  const [loaded, setLoaded] = useState(false);
  const needsReset = useRef(false);
  const detachStateListener = useRef<() => void>(() => {});

  const bindStateListener = () => {
    detachStateListener.current();
    const rawContext = Tone.getContext().rawContext as AudioContext;
    const handleStateChange = () => {
      // iOS can drop real audio output after an interruption (call,
      // Control Center, Bluetooth route change, backgrounding) while the
      // context reports anything other than "running" — flag a rebuild.
      if (rawContext.state !== 'running') needsReset.current = true;
    };
    rawContext.addEventListener('statechange', handleStateChange);
    detachStateListener.current = () =>
      rawContext.removeEventListener('statechange', handleStateChange);
  };

  useEffect(() => {
    let cancelled = false;
    loadSampler().then((sampler) => {
      if (cancelled) return;
      pianoRef.current = sampler;
      bindStateListener();
      setLoaded(true);
    });

    const handleVisibilityChange = () => {
      // iOS's reported AudioContext state after returning to the
      // foreground can't be trusted (it may say "running" while no audio
      // actually reaches the speaker), so always rebuild on the next play
      // rather than trying to detect the broken state precisely.
      if (document.visibilityState === 'visible') needsReset.current = true;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
      detachStateListener.current();
    };
  }, []);

  const resetAudioIfNeeded = async () => {
    if (!needsReset.current) return;
    needsReset.current = false;

    pianoRef.current?.dispose();
    Tone.getContext().dispose();
    Tone.setContext(new Tone.Context());

    setLoaded(false);
    pianoRef.current = await loadSampler();
    bindStateListener();
    setLoaded(true);
  };

  return (
    <AudioContextReact.Provider
      value={{
        getPiano: () => pianoRef.current ?? undefined,
        loaded,
        resetAudioIfNeeded,
      }}
    >
      {children}
    </AudioContextReact.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContextReact);
}
