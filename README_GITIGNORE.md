# Git & NPM Ignore Configuration

このプロジェクトの.gitignoreと.npmignoreファイルの説明です。

## 📁 .gitignore

### **除外される項目**

#### **Node.js関連**
- `node_modules/` - 依存関係
- `*.log` - ログファイル
- `.npm` - npmキャッシュ

#### **TypeScript関連**
- `dist/` - コンパイル済みJavaScript
- `*.tsbuildinfo` - TypeScriptビルドキャッシュ

#### **生成される画像ファイル**
- `*.png, *.jpg, *.jpeg` - テストで生成される地図画像
- `tests/output/` - テスト出力ディレクトリ
- `demo/output/` - デモ出力ディレクトリ

#### **開発環境**
- `.vscode/`, `.idea/` - IDE設定
- `.env*` - 環境変数ファイル
- `*.swp, *.swo` - エディタ一時ファイル

#### **OS関連**
- `.DS_Store` - macOS
- `Thumbs.db` - Windows

## 📦 .npmignore

### **NPMパッケージから除外される項目**

#### **ソースファイル**
- `src/` - TypeScriptソース（dist/のみ配布）
- `tsconfig.json` - TypeScript設定

#### **開発・テストファイル**
- `tests/` - テストファイル
- `demo/` - デモファイル
- 画像ファイル全般

#### **ドキュメント**
- `*.md` （`README.md`以外）
- `README_*.md`

### **NPMパッケージに含まれる項目**
```
static-map-generator/
├── dist/           # コンパイル済みJavaScript
│   ├── index.js
│   ├── index.d.ts
│   ├── types.js
│   └── types.d.ts
├── package.json    # パッケージ情報
├── README.md       # 使用方法
└── LICENSE         # ライセンス
```

## 🔧 カスタマイズ

### **画像ファイルを保持したい場合**
`.gitignore`から以下を削除：
```
*.png
*.jpg
*.jpeg
```

### **特定の出力を保持したい場合**
`.gitignore`に例外を追加：
```
# 特定のファイルは保持
!example-map.png
!docs/images/*.png
```

### **開発者向けファイルをNPMに含める場合**
`.npmignore`から該当行を削除

## 💡 ベストプラクティス

### **Git管理**
- ✅ ソースコード・設定ファイル・ドキュメントは管理
- ❌ 生成ファイル・依存関係・一時ファイルは除外

### **NPM配布**
- ✅ 必要最小限のファイルのみ配布
- ❌ 開発専用ファイル・テスト・画像は除外

### **ファイルサイズ最適化**
```bash
# パッケージサイズ確認
npm pack --dry-run

# 実際のサイズ
npm pack
tar -tzf static-map-generator-1.0.0.tgz
```

## 🚀 確認方法

```bash
# git管理ファイル確認
git status

# npm配布ファイル確認  
npm pack --dry-run

# 実際のテスト
npm install ./static-map-generator-1.0.0.tgz
```

適切な設定により、開発効率とパッケージ品質の両立を実現しています！