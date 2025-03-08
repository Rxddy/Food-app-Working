# Food Delivery Application

A modern food delivery web application with restaurant browsing, ordering, and delivery tracking features.

## Features

- Browse restaurants and menus
- Add items to cart
- Checkout and place orders
- Track order status
- Manage delivery addresses
- User authentication
- Dark/Light theme toggle
- Responsive design for all devices

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Rxddy/Food-app.git
   cd Food-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Environment Variables Setup:
   - Copy the example environment file:
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file and add your own API keys and secrets:
     ```
     # Required
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     
     # Optional (for backend features)
     JWT_SECRET_KEY=your_jwt_secret_key_here
     ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Environment Variables

This project uses environment variables to manage sensitive information. The following variables are required:

| Variable | Description |
|----------|-------------|
| GOOGLE_MAPS_API_KEY | API key for Google Maps integration |
| JWT_SECRET_KEY | Secret key for JWT token generation (for backend) |

## Deployment

To deploy this application:

1. Make sure all environment variables are properly set
2. Build the production version:
   ```
   npm run build
   ```
3. Deploy the contents of the `build` directory to your hosting provider

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from [Font Awesome](https://fontawesome.com/)
- Restaurant images from [Unsplash](https://unsplash.com/)
- Icons from [Flaticon](https://www.flaticon.com/) 