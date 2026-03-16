import { useEffect, useState, useCallback, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { PeerMessage, GameData } from '../types';

export const usePeer = (role: 'teacher' | 'student') => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const connectionsRef = useRef<DataConnection[]>([]);

  const initPeer = useCallback((id?: string) => {
    const newPeer = id ? new Peer(id) : new Peer();
    
    newPeer.on('open', (id) => {
      setMyId(id);
      setPeer(newPeer);
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      setError(err.type === 'disconnected' ? '연결이 끊어졌습니다.' : '통신 오류가 발생했습니다.');
    });

    if (role === 'teacher') {
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
    }

    return newPeer;
  }, [role]);

  useEffect(() => {
    // For students, we might want to wait for manual connect
    // For teachers, we now wait for manual initPeer
    return () => {
      peer?.destroy();
    };
  }, [peer]);

  const connectToHost = useCallback((hostId: string) => {
    // Ensure peer exists
    let activePeer = peer;
    if (!activePeer) {
      activePeer = initPeer();
    }

    const conn = activePeer.connect(hostId);
    
    conn.on('open', () => {
      setConnections([conn]);
      connectionsRef.current = [conn];
    });

    conn.on('data', (data: any) => {
      const msg = data as PeerMessage;
      if (msg.type === 'GAME_DATA') {
        setGameData(msg.data);
      }
      setMessages(prev => [...prev, { from: conn.peer, data: msg }]);
    });

    conn.on('error', (err) => {
      setError('호스트 연결 실패');
    });
  }, [peer, initPeer]);

  const broadcast = useCallback((message: PeerMessage) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }, []);

  const sendToHost = useCallback((message: PeerMessage) => {
    if (connectionsRef.current[0]?.open) {
      connectionsRef.current[0].send(message);
    }
  }, []);

  return { 
    myId, 
    connections, 
    gameData, 
    setGameData, 
    messages, 
    broadcast, 
    sendToHost, 
    connectToHost, 
    initPeer,
    error 
  };
};
