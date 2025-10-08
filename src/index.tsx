import React, {
  createContext,
  useContext as useReactContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

// --- Tipi di base per lo store ---

// Definisce la forma della funzione 'set' che l'utente userà per aggiornare lo stato.
// Accetta un aggiornamento parziale o una funzione che riceve lo stato precedente.
type SetState<T> = (updater: Partial<T> | ((state: T) => Partial<T>)) => void;

// Definisce la forma della funzione 'get' per leggere lo stato corrente.
type GetState<T> = () => T;

// La 'creator function' che l'utente fornirà per definire lo stato iniziale e le azioni.
type StoreCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

// --- Implementazione dello Store ---

/**
 * La classe Store è il cuore della nostra libreria. Non è esposta direttamente all'utente.
 * Ogni Provider crea una singola istanza di questo Store.
 */
class Store<T> {
  private state: T;
  private readonly listeners: Set<() => void> = new Set();

  // FIX: Rendiamo 'setState' un metodo pubblico legato all'istanza.
  public setState: SetState<T> = (updater) => {
    // Determina il prossimo stato, sia che l'updater sia un oggetto o una funzione.
    const nextStatePartial =
      typeof updater === 'function' ? updater(this.state) : updater;

    // Unisce lo stato precedente con l'aggiornamento parziale.
    this.state = { ...this.state, ...nextStatePartial };

    // Notifica tutti i componenti sottoscritti che lo stato è cambiato.
    this.listeners.forEach((listener) => listener());
  };

  constructor(creator: StoreCreator<T>) {
    const getState: GetState<T> = () => this.state;

    // Inizializza lo stato eseguendo la creator function fornita dall'utente,
    // passando il nuovo metodo pubblico 'setState'.
    this.state = creator(this.setState, getState);
  }

  /**
   * Metodo per sottoscrivere un componente ai cambiamenti dello stato.
   * Chiamato da 'useSyncExternalStore'.
   * @param listener La callback da eseguire quando lo stato cambia.
   * @returns Una funzione per annullare la sottoscrizione.
   */
  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    // Restituisce la funzione di 'unsubscribe'.
    return () => this.listeners.delete(listener);
  };

  /**
   * Metodo per ottenere uno snapshot dello stato corrente.
   * Chiamato da 'useSyncExternalStore'.
   */
  public getState = (): T => {
    return this.state;
  };
}

// --- API Pubblica ---

export function createSignalContext<T>(creator: StoreCreator<T>) {
  // Crea un Context React standard. Conterrà l'istanza del nostro Store.
  const Context = createContext<Store<T> | null>(null);

  /**
   * Il componente Provider che l'utente userà per wrappare la sua applicazione
   * o una parte di essa.
   */
  const Provider = ({ children }: { children: ReactNode }) => {
    // useRef assicura che l'istanza dello Store venga creata UNA SOLA VOLTA
    // per tutta la vita del Provider.
    const storeRef = useRef(new Store(creator));

    return (
      <Context.Provider value={storeRef.current}>{children}</Context.Provider>
    );
  };

  /**
   * L'hook potenziato che i componenti useranno per accedere allo stato.
   * @param selector Una funzione che estrae una porzione specifica dello stato.
   */
  const useContext = <S,>(selector: (state: T) => S): S => {
    // Ottiene l'istanza dello store dal Context React.
    const store = useReactContext(Context);
    if (!store) {
      throw new Error('Component must be wrapped in a Provider');
    }

    // Il selettore è obbligatorio per seguire il "pit of success".
    if (typeof selector !== 'function') {
      throw new Error(
        'useContext must be called with a selector function. e.g. useContext(state => state.field)'
      );
    }

    // useSyncExternalStore è l'hook moderno e corretto per sottoscriversi
    // a store esterni in modo sicuro con le feature concorrenti di React 18/19.
    const getSnapshot = () => selector(store.getState());

    // Forniamo getSnapshot anche come terzo argomento per garantire
    // la coerenza e la corretta sottoscrizione agli aggiornamenti.
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  };

  // Esportiamo anche il Context per permettere casi d'uso avanzati
  // come il testing o l'accesso diretto allo store, necessario per il benchmark.
  return { Provider, useContext, Context };
}

