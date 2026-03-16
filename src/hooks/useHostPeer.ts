import { useState, useCallback, useRef, useEffect } from 'react';
import { Peer } from 'peerjs';
import { PeerMessage } from '../types';

export const useHostPeer = () => {
  const [peer, setPeer] = useState<any>(null);
  const [myId, setMyId] = useState<string>('');
  const [connections, setConnections] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const connectionsRef = useRef<any[]>([]);

  const initHost = useCallback((id: string) => {
    try {
      const newPeer = new Peer(id);
      
      newPeer.on('open', (id: string) => {
        setMyId(id);
        setPeer(newPeer);
      });

      newPeer.on('error', (err) => {
        console.error('Host Peer error:', err);
        if (err.type === 'unavailable-id') {
          setError('이미 사용 중인 세션 코드입니다.');
        } else {
          setError(`통신 오류: ${err.type}`);
        }
      });

      newPeer.on('connection', (conn) => {
        conn.on('open', () => {
          setConnections(prev => [...prev, conn]);
          connectionsRef.current = [...connectionsRef.current, conn];
        });

        conn.on('data', (data) => {
          setMessages(prev => [...prev, { from: conn.peer, data }]);
        });

        conn.on('close', () => {
          setConnections(prev => prev.filter(c => c.peer !== conn.peer));
          connectionsRef.current = connectionsRef.current.filter(c => c.peer !== conn.peer);
        });
      });

      return newPeer;
    } catch (err) {
      console.error('Peer initialization failed:', err);
      setError('PeerJS 초기화 실패');
      return null;
    }
  }, []);

  const broadcast = useCallback((message: PeerMessage) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      peer?.destroy();
    };
  }, [peer]);

  return { myId, connections, messages, broadcast, initHost, error, setError };
};
