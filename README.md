# JSON Translator

A modern web application for translating JSON files using OpenAI's API while preserving structure and protecting placeholders.

## Features

- 🌍 **40+ Languages**: Support for a wide range of languages
- 🔒 **Structure Preservation**: Maintains exact JSON structure and formatting
- 🛡️ **Pattern Protection**: Automatically protects placeholders like `[country_code]` and `[underscored_patterns]`
- ⚡ **Real-time Preview**: See original and translated JSON side by side
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔐 **Secure**: Your API key is never stored, only used temporarily
- 📥 **Easy Download**: Download translated JSON files instantly

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd json-translator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Upload JSON File**: Drag and drop or click to select a JSON file
2. **Enter API Key**: Provide your OpenAI API key (never stored)
3. **Select Language**: Choose the target language for translation
4. **Translate**: Click "Start Translation" to begin
5. **Download**: Download the translated JSON file

### Pattern Protection

The application automatically protects the following patterns from translation:
- `[country_code]` → stays as `[country_code]`
- `[user_name]` → stays as `[user_name]`
- `[api_key]` → stays as `[api_key]`
- `[underscored_pattern]` → stays as `[underscored_pattern]`
- Any pattern matching `[anything_here]` format

### Example

**Input JSON:**
```json
{
  "welcome": "Hello [user_name], welcome to our app!",
  "country": "Your country is [country_code]"
}
```

**Translated to Spanish:**
```json
{
  "welcome": "¡Hola [user_name], bienvenido a nuestra aplicación!",
  "country": "Tu país es [country_code]"
}
```

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Translation service
- **Lucide React** - Icons
- **File-saver** - File downloads

## API Endpoints

### POST /api/translate

Translates JSON content using OpenAI's API.

**Request Body:**
```json
{
  "json": { /* JSON object to translate */ },
  "targetLanguage": "es",
  "apiKey": "your-openai-api-key"
}
```

**Response:**
```json
{
  "translatedJson": { /* Translated JSON object */ }
}
```

## Error Handling

The application handles various error scenarios:
- Invalid JSON files
- Missing API key
- Invalid OpenAI API key
- Rate limiting
- Network errors
- Translation failures

## Security

- API keys are never stored or logged
- All processing happens client-side and server-side
- No data persistence
- Secure API communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
