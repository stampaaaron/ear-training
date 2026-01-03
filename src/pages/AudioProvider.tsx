import {
  createContext,
  useContext,
  useRef,
  useEffect,
  PropsWithChildren,
  useState,
} from 'react';
import * as Tone from 'tone';

const AudioContextReact = createContext<{
  piano?: Tone.Sampler;
  loaded: boolean;
}>({ loaded: false });

export function AudioProvider({ children }: PropsWithChildren) {
  const piano = useRef<Tone.Sampler | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    piano.current = new Tone.Sampler({
      urls: {
        A3: 'A3.wav',
        A4: 'A4.wav',
        A5: 'A5.wav',
      },
      onload: () => setLoaded(true),
      baseUrl: '/',
    }).toDestination();
  }, []);

  return (
    <AudioContextReact.Provider
      value={{ piano: piano.current ?? undefined, loaded }}
    >
      {children}
    </AudioContextReact.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContextReact);
}
