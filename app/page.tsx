'use client';

// React
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

// Amplify - Storage
import {
  getUrl,
  list,
  type ListAllWithPathOutput,
  uploadData,
} from 'aws-amplify/storage';

// Lucide React
import {
  Bot,
  FileUp,
  Mic,
  Video,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// ホーム
export default function HomePage() {
  // 文字起こし一覧
  const [transcriptions, setTranscriptions] = useState<ListAllWithPathOutput['items']>([]);

  // 画面収録中かどうか
  const [isRecording, setIsRecording] = useState(false);

  // 画面収録
  const startRecording = useCallback(async () => {
    try {
      // 画面収録中にする
      setIsRecording(true);

      // 画面収録ストリーム
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // マイク音声ストリーム
      const micStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      // 音声ストリームを統合
      const audioContext = new AudioContext();
      const audioDest = audioContext.createMediaStreamDestination();

      // 画面収録データの音声ストリームを統合
      const displayAudioTracks = displayStream.getAudioTracks();
      if (displayAudioTracks.length > 0) {
        const displayAudioSource = audioContext.createMediaStreamSource(new MediaStream(displayAudioTracks));
        displayAudioSource.connect(audioDest);
      }

      // マイク音声ストリームを統合
      const micSource = audioContext.createMediaStreamSource(micStream);
      micSource.connect(audioDest);

      // 統合された音声ストリームと画面映像を結合
      const combinedStream = new MediaStream([...displayStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()]);

      // 画面収録データを録音
      const recorder = new MediaRecorder(combinedStream);

      // 画面収録データのチャンク
      const chunks: Blob[] = [];

      // 画面収録データが利用可能になったら
      recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      });

      // 画面収録データが利用可能になったら
      recorder.addEventListener('stop', async () => {
        // 画面収録データをアップロード
        await uploadData({
          path: ({ identityId }) => `transcriptions/${identityId}/${Date.now()}.webm`,
          data: new Blob(chunks, {
            type: 'video/webm',
          }),
          options: {
            contentType: 'video/webm',
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(`Upload progress ${Math.round((transferredBytes / totalBytes) * 100)} %`);
              }
            },
          },
        }).result;

        setIsRecording(false);
      });

      // 画面収録が停止したら
      displayStream.getTracks()[0].addEventListener('ended', () => {
        // マイク音声ストリームを停止
        micStream.getTracks().forEach((track) => track.stop());

        // 画面収録データの録音を停止
        recorder.stop();
      });

      // 画面収録データの録音を開始
      recorder.start(1000);
    } catch {
      setIsRecording(false);
    }
  }, []);

  // 画面収録
  const download = useCallback(async (path: string) => {
    try {
      const result = await getUrl({
        path,
      });
      const a = document.createElement('a');
      a.href = result.url.toString();
      a.target = '_blank';
      a.download = path;
      a.click();
    } catch {
      console.error('Failed to download transcription');
    }
  }, []);

  useEffect(() => {
    (async () => {
      // 文字起こし一覧を取得
      const result = await list({
        path: ({ identityId }) => `transcriptions/${identityId}/`,
        options: {
          listAll: true,
        },
      });

      // 文字起こし一覧を格納
      setTranscriptions(result.items.reverse());
    })();
  }, [isRecording]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='text-lg font-bold'>
          ホーム
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Button disabled size='lg' variant='outline'>
          <Mic />
          録音開始
        </Button>
        <Button disabled size='lg' variant='outline'>
          <FileUp />
          アップロード
        </Button>
        <Button disabled size='lg' variant='outline'>
          <Bot />
          Web会議の文字起こし
        </Button>
        <Button disabled={isRecording} size='lg' variant='outline' onClick={startRecording}>
          <Video />
          画面収録
        </Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-lg font-bold'>
          マイノート
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {transcriptions.map((transcription) => (
          <div key={transcription.eTag}>
            <Button variant='link' onClick={() => download(transcription.path)}>
              {transcription.path} | {transcription.size} bytes | {transcription.lastModified?.toLocaleString()}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
