declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => object;
        LatLngBounds: new () => {
          extend: (latlng: object) => void;
        };
        Map: new (
          container: HTMLElement,
          options: Record<string, unknown>,
        ) => {
          panTo: (latlng: object) => void;
          setBounds: (bounds: object) => void;
          setCenter: (latlng: object) => void;
        };
        Marker: new (options: Record<string, unknown>) => {
          setMap: (map: object | null) => void;
        };
        CustomOverlay: new (options: Record<string, unknown>) => {
          setMap: (map: object | null) => void;
        };
      };
    };
  }
}

type KakaoNamespace = NonNullable<Window["kakao"]>;

let kakaoMapsPromise: Promise<KakaoNamespace> | undefined;

export function loadKakaoMaps(appKey: string): Promise<KakaoNamespace> {
  if (!appKey) {
    return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_APP_KEY is empty"));
  }

  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps can only load in the browser"));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoMapsPromise) return kakaoMapsPromise;

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao?.maps.load(() => {
        if (window.kakao) resolve(window.kakao);
        else reject(new Error("Kakao Maps namespace was not created"));
      });
    };
    script.onerror = () => {
      reject(new Error("Failed to load Kakao Maps script"));
    };
    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}
