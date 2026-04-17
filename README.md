# ChatVRM — ローカルAIデジタルサイネージ

VRMアバターとリアルタイムに対話できるローカル完結型のAIアプリケーションです。[pixiv/ChatVRM](https://github.com/pixiv/ChatVRM) をベースに、すべての推論処理をローカル環境で実行できるよう改修しています。

## 技術スタック

| 機能 | 技術 |
|------|------|
| 音声認識（STT） | [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper)（OpenAI互換API） |
| 返答文の生成（LLM） | [LM Studio](https://lmstudio.ai/)（OpenAI互換API、Vision対応） |
| 読み上げ音声の生成（TTS） | [VOICEVOX](https://voicevox.hiroshiba.jp/) |
| 視覚認識（Vision） | Webカメラキャプチャ + LM Studio（Visionモデル） |
| 3Dキャラクターの表示 | [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) |
| フロントエンド | Next.js 13 / React 18 / TypeScript / Tailwind CSS |

## 前提条件

- Node.js 16以上
- Docker / Docker Compose
- [LM Studio](https://lmstudio.ai/) — LLMの推論サーバー

## 起動方法

### 1. リポジトリのクローンと依存パッケージのインストール

```bash
git clone <このリポジトリのURL>
cd ChatVRM
npm install
```

### 2. VOICEVOX / Faster-Whisper の起動

Docker Compose で音声合成（VOICEVOX）と音声認識（Faster-Whisper）サーバーを起動します。

```bash
docker compose up -d
```

起動するサービス:

| サービス | ポート | 用途 |
|---------|--------|------|
| VOICEVOX Engine | `localhost:50021` | 音声合成（TTS） |
| Faster-Whisper Server | `localhost:8000` | 音声認識（STT） |

#### GPU版を利用する場合

`docker-compose.yml` 内の各サービスでコメントを切り替えてください。

```yaml
# CPU版（デフォルト）をコメントアウトし、GPU版のコメントを外す
# image: voicevox/voicevox_engine:cpu-latest
image: voicevox/voicevox_engine:nvidia-latest
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

### 3. LM Studio の起動

1. [LM Studio](https://lmstudio.ai/) をインストール・起動
2. Vision対応モデル（例: Gemma 4）をダウンロード・ロード
3. ローカルサーバーを起動（デフォルト: `http://localhost:1234`）

### 4. アプリケーションの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### 5. 初期設定

画面左上の歯車アイコンから設定画面を開き、以下を入力してください。

| 設定項目 | 値の例 |
|---------|--------|
| LM Studio API URL | `http://localhost:1234` |
| Model | （自動検出されるリストから選択） |
| Faster-Whisper API URL | `http://localhost:8000` |
| 声の選択 | お好みのVOICEVOX話者を選択 |

## 機能

### 対話機能
- テキスト入力またはマイク（Push-to-Talk）で質問
- LLMがキャラクターとして返答し、VOICEVOXで音声読み上げ
- アバターの表情・リップシンクが自動連動

### Vision機能
- 画面下部の「Vision ON/OFF」ボタンでカメラを有効化
- Vision ON時、メッセージ送信と同時にカメラ映像をLLMに送信
- 「これ何？」のような視覚的な質問に対応

### STT機能（音声認識）
- 画面下部の「STT ON/OFF」ボタンで音声入力を有効化
- STT ON時、録音ボタンで録音開始 → 再度押して停止 → 自動で文字起こし・送信

## 利用技術の詳細

### LM Studio
ローカルでLLMを実行するためのアプリケーションです。OpenAI互換APIを提供するため、本アプリケーションからシームレスに接続できます。

- [https://lmstudio.ai/](https://lmstudio.ai/)

### VOICEVOX
無料で使える中品質なテキスト読み上げソフトウェアです。19種類以上の話者から選択できます。

- [https://voicevox.hiroshiba.jp/](https://voicevox.hiroshiba.jp/)

### Faster-Whisper
OpenAIのWhisperモデルを高速に実行するライブラリです。本アプリケーションでは [faster-whisper-server](https://github.com/fedirz/faster-whisper-server) を使用し、OpenAI互換APIとして提供しています。

- [https://github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- [https://github.com/fedirz/faster-whisper-server](https://github.com/fedirz/faster-whisper-server)
