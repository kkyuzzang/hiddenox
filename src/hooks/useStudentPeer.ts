import { useState, useCallback, useRef, useEffect } from 'react';
import { Peer } from 'peerjs';
import { PeerMessage, GameData } from '../types';

export const useStudentPeer = () => {
  const [peer, setPeer] = useState<any>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const [showAnswers, setShowAnswers] = useState(false);
  const connRef = useRef<any>(null);

  const connectToHost = useCallback((hostId: string, nickname: string) => {
    try {
      const newPeer = new Peer();
      
      newPeer.on('open', () => {
        const conn = newPeer.connect(hostId);
        
        conn.on('open', () => {
          setIsConnected(true);
          connRef.current = conn;
          // Send join message immediately
          conn.send({ type: 'JOIN', nickname });
        });

        conn.on('data', (data: any) => {
          const msg = data as PeerMessage;
          if (msg.type === 'GAME_DATA') {
            setGameData(msg.data);
          } else if (msg.type === 'SHOW_ANSWERS') {
            setShowAnswers(true);
          }
        });

        conn.on('error', (err) => {
          setError('호스트 연결에 실패했습니다.');
        });

        conn.on('close', () => {
          setIsConnected(false);
          setError('호스트와의 연결이 끊어졌습니다.');
        });
      });

      newPeer.on('error', (err) => {
        setError('통신 오류가 발생했습니다.');
      });

      setPeer(newPeer);
    } catch (err) {
      console.error('Peer initialization failed:', err);
      setError('PeerJS 초기화 실패');
    }
  }, []);

  const sendToHost = useCallback((message: PeerMessage) => {
    if (connRef.current?.open) {
      connRef.current.send(message);
    }
  }, []);

  useEffect(() => {
    return () => {
      peer?.destroy();
    };
  }, [peer]);

  return { gameData, isConnected, sendToHost, connectToHost, error, showAnswers };
};
