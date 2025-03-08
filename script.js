// Global variables
let map;
let autocomplete;
let cart = [];
let currentUser = null;
let selectedAddress = null;
let orders = [];
let favorites = [];
let promoCodes = {
  'WELCOME10': { discount: 0.1, description: '10% off your first order' },
  'FREESHIP': { discount: 0, freeShipping: true, description: 'Free shipping on your order' }
};

// Check if we're running on GitHub Pages
const isGitHubPages = window.APP_CONFIG && window.APP_CONFIG.isGitHubPages;

// Dark mode map style for Google Maps
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "Fast Food",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.99",
    tags: ["Burgers", "Fast Food", "American"],
    menu: [
      { name: "Classic Burger", price: 8.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
      { name: "Cheeseburger", price: 9.99, image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&auto=format&fit=crop&q=60" },
      { name: "Double Burger", price: 12.99, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Sandwich", price: 8.99, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60" },
      { name: "French Fries", price: 3.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 2,
    name: "Pizza Heaven",
    cuisine: "Italian",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    rating: 4.3,
    deliveryTime: "25-35 min",
    deliveryFee: "$1.99",
    tags: ["Pizza", "Italian", "Pasta"],
    menu: [
      { name: "Margherita Pizza", price: 12.99, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60" },
      { name: "Pepperoni Pizza", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60" },
      { name: "Cheese Pizza", price: 13.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60" },
      { name: "Spaghetti Bolognese", price: 11.99, image: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=500&auto=format&fit=crop&q=60" },
      { name: "Garlic Bread", price: 4.99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 3,
    name: "Sushi Express",
    cuisine: "Japanese",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "$3.99",
    tags: ["Sushi", "Japanese", "Asian", "Healthy"],
    menu: [
      { name: "California Roll (8pcs)", price: 9.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60" },
      { name: "Salmon Nigiri (4pcs)", price: 8.99, image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500&auto=format&fit=crop&q=60" },
      { name: "Tuna Roll (8pcs)", price: 10.99, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetable Roll (8pcs)", price: 7.99, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=60" },
      { name: "Miso Soup", price: 2.99, image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 4,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/8688/8688563.png",
    rating: 4.2,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.49",
    tags: ["Mexican", "Tacos", "Fast Food"],
    menu: [
      { name: "Beef Taco (3pcs)", price: 8.99, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Quesadilla", price: 9.99, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetarian Burrito", price: 8.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60" },
      { name: "Nachos Supreme", price: 7.99, image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500&auto=format&fit=crop&q=60" },
      { name: "Guacamole & Chips", price: 4.99, image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 5,
    name: "Golden Dragon",
    cuisine: "Chinese",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1471/1471262.png",
    rating: 4.4,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.99",
    tags: ["Chinese", "Asian", "Noodles"],
    menu: [
      { name: "Kung Pao Chicken", price: 12.99, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60" },
      { name: "Beef with Broccoli", price: 13.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetable Fried Rice", price: 9.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60" },
      { name: "Spring Rolls (4pcs)", price: 5.99, image: "https://images.unsplash.com/photo-1606335543042-57c525922933?w=500&auto=format&fit=crop&q=60" },
      { name: "Wonton Soup", price: 4.99, image: "https://images.unsplash.com/photo-1626309549942-9cf8d2fb0903?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 6,
    name: "Healthy Greens",
    cuisine: "Salads",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1147/1147805.png",
    rating: 4.6,
    deliveryTime: "15-25 min",
    deliveryFee: "$3.49",
    tags: ["Salads", "Healthy", "Vegan"],
    menu: [
      { name: "Caesar Salad", price: 10.99, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60" },
      { name: "Greek Salad", price: 11.99, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60" },
      { name: "Quinoa Bowl", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60" },
      { name: "Avocado Toast", price: 8.99, image: "https://images.unsplash.com/photo-1603046891744-76e6300f82ef?w=500&auto=format&fit=crop&q=60" },
      { name: "Fresh Fruit Smoothie", price: 5.99, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 7,
    name: "Spice of India",
    cuisine: "Indian",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: "$2.99",
    tags: ["Indian", "Curry", "Asian"],
    menu: [
      { name: "Butter Chicken", price: 14.99, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetable Biryani", price: 12.99, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60" },
      { name: "Lamb Curry", price: 15.99, image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?w=500&auto=format&fit=crop&q=60" },
      { name: "Garlic Naan", price: 3.99, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60" },
      { name: "Samosas (2pcs)", price: 4.99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 8,
    name: "Mediterranean Delight",
    cuisine: "Mediterranean",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3448/3448122.png",
    rating: 4.8,
    deliveryTime: "25-40 min",
    deliveryFee: "$3.99",
    tags: ["Mediterranean", "Healthy", "Premium"],
    menu: [
      { name: "Lamb Kebab Plate", price: 16.99, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=60" },
      { name: "Falafel Wrap", price: 9.99, image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=500&auto=format&fit=crop&q=60" },
      { name: "Greek Salad", price: 11.99, image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60" },
      { name: "Hummus & Pita", price: 6.99, image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=60" },
      { name: "Baklava", price: 4.99, image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 9,
    name: "Fried Chicken Heaven",
    cuisine: "American",
    price: "$",
    logo: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png",
    rating: 4.1,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    tags: ["Chicken", "Fast Food", "American", "Deals"],
    menu: [
      { name: "Fried Chicken Bucket (8pcs)", price: 15.99, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Sandwich", price: 7.99, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Tenders (5pcs)", price: 8.99, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60" },
      { name: "Mashed Potatoes", price: 3.99, image: "https://images.unsplash.com/photo-1600175074394-5d23b9f4d1e0?w=500&auto=format&fit=crop&q=60" },
      { name: "Coleslaw", price: 2.99, image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 10,
    name: "Steakhouse Supreme",
    cuisine: "Steakhouse",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
    rating: 4.9,
    deliveryTime: "30-45 min",
    deliveryFee: "$4.99",
    tags: ["Steak", "Premium", "American"],
    menu: [
      { name: "Ribeye Steak", price: 29.99, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60" },
      { name: "Filet Mignon", price: 32.99, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=60" },
      { name: "New York Strip", price: 27.99, image: "https://images.unsplash.com/photo-1579366948929-444eb79881eb?w=500&auto=format&fit=crop&q=60" },
      { name: "Loaded Baked Potato", price: 6.99, image: "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?w=500&auto=format&fit=crop&q=60" },
      { name: "Creamed Spinach", price: 5.99, image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 11,
    name: "Breakfast All Day",
    cuisine: "Breakfast",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3361/3361434.png",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.49",
    tags: ["Breakfast", "American", "Deals"],
    menu: [
      { name: "Pancake Stack", price: 8.99, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60" },
      { name: "Eggs Benedict", price: 11.99, image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&auto=format&fit=crop&q=60" },
      { name: "Breakfast Burrito", price: 9.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60" },
      { name: "French Toast", price: 8.99, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&auto=format&fit=crop&q=60" },
      { name: "Fresh Orange Juice", price: 3.99, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 12,
    name: "Gourmet Burgers",
    cuisine: "Burgers",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/5787/5787253.png",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "$3.99",
    tags: ["Burgers", "Premium", "American"],
    menu: [
      { name: "Truffle Burger", price: 16.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
      { name: "Wagyu Beef Burger", price: 18.99, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60" },
      { name: "Portobello Mushroom Burger", price: 14.99, image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500&auto=format&fit=crop&q=60" },
      { name: "Sweet Potato Fries", price: 5.99, image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60" },
      { name: "Craft Beer", price: 6.99, image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 13,
    name: "Fresh Poke",
    cuisine: "Hawaiian",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3978/3978754.png",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: "$3.49",
    tags: ["Poke", "Healthy", "Seafood"],
    menu: [
      { name: "Tuna Poke Bowl", price: 14.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60" },
      { name: "Salmon Poke Bowl", price: 14.99, image: "https://images.unsplash.com/photo-1563950708942-db5d9dcca7a7?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetarian Poke Bowl", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60" },
      { name: "Seaweed Salad", price: 4.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
      { name: "Miso Soup", price: 2.99, image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 14,
    name: "Noodle House",
    cuisine: "Asian Fusion",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1471/1471262.png",
    rating: 4.4,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.99",
    tags: ["Noodles", "Asian", "Ramen"],
    menu: [
      { name: "Tonkotsu Ramen", price: 13.99, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&auto=format&fit=crop&q=60" },
      { name: "Beef Pho", price: 12.99, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60" },
      { name: "Pad See Ew", price: 11.99, image: "https://images.unsplash.com/photo-1562967915-92ae0c320a01?w=500&auto=format&fit=crop&q=60" },
      { name: "Gyoza (6pcs)", price: 6.99, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=60" },
      { name: "Bubble Tea", price: 4.99, image: "https://images.unsplash.com/photo-1558857563-c0c6ee6ff8e4?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 15,
    name: "Seafood Market",
    cuisine: "Seafood",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2555/2555884.png",
    rating: 4.8,
    deliveryTime: "30-45 min",
    deliveryFee: "$4.99",
    tags: ["Seafood", "Premium", "Healthy"],
    menu: [
      { name: "Grilled Salmon", price: 18.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
      { name: "Shrimp Scampi", price: 16.99, image: "https://images.unsplash.com/photo-1633504581786-316f8ebee9a8?w=500&auto=format&fit=crop&q=60" },
      { name: "Lobster Roll", price: 21.99, image: "https://images.unsplash.com/photo-1559304822-9eb2813c9844?w=500&auto=format&fit=crop&q=60" },
      { name: "Clam Chowder", price: 7.99, image: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=500&auto=format&fit=crop&q=60" },
      { name: "Fish Tacos", price: 12.99, image: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 16,
    name: "Taqueria Express",
    cuisine: "Mexican",
    price: "$",
    logo: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    rating: 4.2,
    deliveryTime: "10-20 min",
    deliveryFee: "$1.99",
    tags: ["Mexican", "Tacos", "Deals", "Fast Food"],
    menu: [
      { name: "Street Tacos (3pcs)", price: 6.99, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60" },
      { name: "Super Burrito", price: 8.99, image: "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=500&auto=format&fit=crop&q=60" },
      { name: "Chips & Salsa", price: 3.99, image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=500&auto=format&fit=crop&q=60" },
      { name: "Quesadilla", price: 7.99, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60" },
      { name: "Horchata", price: 2.99, image: "https://images.unsplash.com/photo-1620057803353-6b0d54d8d3b0?w=500&auto=format&fit=crop&q=60" }
    ]
  }
];

// Initialize Google Maps
function initMap() {
  // Default location (San Francisco)
  const defaultLocation = { lat: 37.7749, lng: -122.4194 };
  
  // Check if dark mode is active
  const isDarkMode = document.body.hasAttribute('data-theme') && document.body.getAttribute('data-theme') === 'dark';
  
  // Create map with appropriate style
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 13,
    mapTypeControl: false,
    styles: isDarkMode ? DARK_MAP_STYLE : []
  });
  
  // Create marker
  const marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true
  });
  
  // Initialize autocomplete
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('address'),
    { types: ['address'] }
  );
  
  // Bias autocomplete results to current map bounds
  autocomplete.bindTo('bounds', map);
  
  // Update map when place is selected
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
      console.log("No location data for: " + place.name);
      return;
    }
    
    // Update map
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
  } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    
    // Update marker
    marker.setPosition(place.geometry.location);
  });
  
  // Update address field when marker is dragged
  marker.addListener('dragend', function() {
    const position = marker.getPosition();
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: position }, function(results, status) {
      if (status === 'OK' && results[0]) {
        document.getElementById('address').value = results[0].formatted_address;
      }
    });
  });
}

// Add address function
function addAddress() {
  const addressInput = document.getElementById('address');
  const address = addressInput.value.trim();
  
  if (!address) {
    alert('Please enter an address');
    return;
  }
  
  // Get addresses from localStorage or initialize empty array
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  // Add new address
  addresses.push(address);
  
  // Save to localStorage
  localStorage.setItem('addresses', JSON.stringify(addresses));
  
  // Update address list
  loadAddresses();
  
  // Clear input
  addressInput.value = '';
  
  alert('Address added successfully');
}

// Update loadAddresses function
function loadAddresses() {
  const addressList = document.getElementById('address-list');
  if (!addressList) return;
  
  // Get addresses from localStorage
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  const selectedAddress = localStorage.getItem('selectedAddress') || '';
  
  // Update address display
  const addressDisplay = document.getElementById('selected-address-display');
  if (addressDisplay) {
    addressDisplay.textContent = selectedAddress || 'Select delivery address';
  }
  
  // Clear list
  addressList.innerHTML = '';
  
  // Add addresses to list
  addresses.forEach((address, index) => {
    const li = document.createElement('li');
    
    li.innerHTML = `
        <span>${address}</span>
        <div class="address-actions">
        <button class="select-address-btn" onclick="selectAddress(${index})">Select</button>
          <button class="delete-address-btn" onclick="deleteAddress(${index})">Delete</button>
      </div>
    `;
    
    addressList.appendChild(li);
  });
}

// Select address function
function selectAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  if (index >= 0 && index < addresses.length) {
    const selectedAddress = addresses[index];
    localStorage.setItem('selectedAddress', selectedAddress);
    
    // Update address display
    const addressDisplay = document.getElementById('selected-address-display');
    if (addressDisplay) {
      addressDisplay.textContent = selectedAddress;
    }
    
    alert(`Selected address: ${selectedAddress}`);
  }
}

// Delete address function
function deleteAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  if (index >= 0 && index < addresses.length) {
    addresses.splice(index, 1);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    // Update address list
    loadAddresses();
    
    alert('Address deleted successfully');
  }
}

// Make address functions globally available
window.addAddress = addAddress;
window.selectAddress = selectAddress;
window.deleteAddress = deleteAddress;

// Initialize Google Maps when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load saved data
  loadSavedData();
  
  // Check if user is logged in
  if (currentUser) {
    showTab('restaurants');
    document.getElementById('user-dashboard').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
  } else {
    document.getElementById('login-page').style.display = 'block';
  }
  
  // Initialize map if Google Maps API is loaded
  if (typeof google !== 'undefined') {
    initMap();
  } else {
    // If Google Maps API is not loaded yet, wait for it
    window.initMapWhenApiLoaded = function() {
      // Add event listener to addresses tab
      document.getElementById('addresses-tab').addEventListener('click', function() {
        setTimeout(initMap, 100); // Small delay to ensure the tab is visible
      });
    };
    
    // Check periodically if Google Maps API is loaded
    const mapApiCheckInterval = setInterval(function() {
      if (typeof google !== 'undefined') {
        clearInterval(mapApiCheckInterval);
        initMap();
        window.initMapWhenApiLoaded();
      }
    }, 500);
  }
  
  // Add event listener to addresses tab
  document.getElementById('addresses-tab') && document.getElementById('addresses-tab').addEventListener('click', function() {
    if (typeof google !== 'undefined') {
      setTimeout(initMap, 100); // Small delay to ensure the tab is visible
    }
  });
  
  // Load theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    document.querySelector('.theme-toggle i').classList.remove('fa-moon');
    document.querySelector('.theme-toggle i').classList.add('fa-sun');
  }
});

// Authentication functions
function showLogin() {
  document.getElementById("login-page").style.display = "block";
  document.getElementById("registration-page").style.display = "none";
  document.getElementById("user-dashboard").style.display = "none";
}

function showRegistrationPage() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("registration-page").style.display = "block";
  document.getElementById("user-dashboard").style.display = "none";
}

// Essential dashboard functions
function showRestaurants() {
  // Just call filterRestaurants with 'All' to show all restaurants
  filterRestaurants('All');
}

function showRestaurantMenu(restaurant) {
  // Create modal element
  const menuModal = document.createElement('div');
  menuModal.className = 'menu-modal';
  menuModal.id = 'menu-modal';
  
  // Create modal content
  menuModal.innerHTML = `
    <div class="menu-content">
      <div class="menu-header">
        <div class="restaurant-menu-header">
          <div class="restaurant-info">
            <h2>${restaurant.name}</h2>
            <div class="restaurant-meta">
              <span>${restaurant.cuisine}</span>
              <span>${restaurant.price}</span>
            </div>
          </div>
          <div class="restaurant-rating">
            <i class="fas fa-star"></i> ${restaurant.rating}
          </div>
        </div>
        <div class="restaurant-delivery">
          <span>${restaurant.deliveryTime}</span>
          <span class="delivery-fee">Delivery: ${restaurant.deliveryFee}</span>
        </div>
        <button class="close-menu-btn">&times;</button>
      </div>
      <div class="menu-items">
        <h3>Menu</h3>
        <div class="menu-items-list">
          ${restaurant.menu.map(item => `
            <div class="menu-item">
              ${item.image ? `<div class="menu-item-image"><img src="${item.image}" alt="${item.name}"></div>` : ''}
              <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price}</p>
              </div>
              <button class="add-to-cart-btn" onclick="addToCart('${restaurant.id}', '${item.name}', ${item.price})">
                Add to Cart
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(menuModal);
  
  // Show modal
  setTimeout(() => {
    menuModal.style.display = 'flex';
  }, 10);
  
  // Add event listener to close button
  const closeBtn = menuModal.querySelector('.close-menu-btn');
  closeBtn.addEventListener('click', closeMenu);
  
  // Add event listener to close when clicking outside
  menuModal.addEventListener('click', function(event) {
    if (event.target === menuModal) {
      closeMenu();
    }
  });
}

// Close menu modal
function closeMenu() {
  const menuModal = document.getElementById('menu-modal');
  if (menuModal) {
    menuModal.style.display = 'none';
    setTimeout(() => {
      menuModal.remove();
    }, 300);
  }
}

// Add to cart function
function addToCart(restaurantId, itemName, price) {
  // Find restaurant
  const restaurant = restaurants.find(r => r.id == restaurantId);
  
  if (!restaurant) return;
  
  // Create cart item
  const cartItem = {
    restaurantId,
    restaurantName: restaurant.name,
    itemName,
    price
  };
  
  // Add to cart
  cart.push(cartItem);
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart indicator
  updateCartIndicator();
  
  // Show confirmation
  alert(`Added ${itemName} to cart!`);
}

// Make menu functions globally available
window.showRestaurantMenu = showRestaurantMenu;
window.closeMenu = closeMenu;
window.addToCart = addToCart;

function updateCartIndicator() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll('.tabs button');
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
    
    // Add active class to tab button
    const tabButton = document.getElementById(`${tabName}-tab`);
    if (tabButton) {
      tabButton.classList.add('active');
    }
    
    // Special handling for different tabs
    if (tabName === 'favorites') {
      showFavorites();
    } else if (tabName === 'restaurants') {
      showRestaurants();
    } else if (tabName === 'addresses') {
      // Initialize map when addresses tab is shown
      if (typeof google !== 'undefined') {
        setTimeout(initMap, 100); // Small delay to ensure the tab is visible
      }
      loadAddresses();
    } else if (tabName === 'orders') {
      // Show all orders by default
      filterOrders('all');
    }
  }
}

// Modified loginUser function for GitHub Pages compatibility
async function loginUser(event) {
  if (event) event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }
  
  if (isGitHubPages) {
    // For GitHub Pages demo, use mock login
    console.log('GitHub Pages demo: Using mock login');
    
    // Set a demo user
    localStorage.setItem('userToken', 'demo-token');
    localStorage.setItem('userEmail', username + '@example.com');
    
    // Show dashboard
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';
    
    // Load demo data
    loadSavedData();
    return;
  }
  
  // Original login code for non-GitHub Pages environment
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userEmail', data.email);
      
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('user-dashboard').style.display = 'block';
      
      loadSavedData();
    } else {
      alert(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}

// Modified registerUser function for GitHub Pages compatibility
async function registerUser() {
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  
  if (!username || !email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  if (isGitHubPages) {
    // For GitHub Pages demo, use mock registration
    console.log('GitHub Pages demo: Using mock registration');
    
    // Set a demo user
    localStorage.setItem('userToken', 'demo-token');
    localStorage.setItem('userEmail', email);
    
    // Show dashboard
    document.getElementById('registration-page').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';
    
    // Load demo data
    loadSavedData();
    return;
  }
  
  // Original registration code for non-GitHub Pages environment
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Registration successful! Please log in.');
      showLogin();
    } else {
      alert(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again.');
  }
}

function logoutUser() {
  // Clear all user-related data from localStorage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  localStorage.removeItem("addresses");
  localStorage.removeItem("selectedAddress");
  localStorage.removeItem("favorites");
  
  // Reset global variables
  cart = [];
  currentUser = null;
  selectedAddress = "";
  favorites = [];
  
  // Show login page
  document.getElementById("user-dashboard").style.display = "none";
  document.getElementById("login-page").style.display = "block";
}

// Make functions globally available
window.showLogin = showLogin;
window.showRegistrationPage = showRegistrationPage;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.showTab = showTab;
window.toggleTheme = toggleTheme;
window.addAddress = addAddress;
window.selectAddress = selectAddress;
window.deleteAddress = deleteAddress;
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.showCart = showCart;
window.closeCart = closeCart;
window.showCheckout = showCheckout;
window.closeCheckout = closeCheckout;
window.processOrder = processOrder;
window.removeFromCart = removeFromCart;
window.filterOrders = filterOrders;
window.sortRestaurants = sortRestaurants;
window.filterRestaurants = filterRestaurants;

// Initialize filter buttons
document.addEventListener('DOMContentLoaded', function() {
  const filterChips = document.querySelectorAll('.filter-chip');
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      filterRestaurants(this.textContent);
    });
  });
});

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing application');
  
  try {
    console.log('Checking login state...');
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log('Is logged in:', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('User is logged in, showing dashboard');
      document.getElementById("login-page").style.display = "none";
      document.getElementById("registration-page").style.display = "none";
      document.getElementById("user-dashboard").style.display = "block";
      
      // Load user data
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        currentUser = JSON.parse(userData);
        console.log('Loaded user data:', currentUser);
      }
      
      showRestaurants();
      updateCartIndicator();
      loadAddresses();
    } else {
      console.log('User is not logged in, showing login page');
      showLogin();
    }
  } catch (error) {
    console.error('Error during initialization:', error);
    // If something goes wrong, show login page
    showLogin();
  }
});

// Initialize settings dropdown
document.addEventListener('DOMContentLoaded', function() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsContent = document.querySelector('.settings-content');
  
  if (settingsBtn && settingsContent) {
    settingsBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      settingsContent.style.display = settingsContent.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      settingsContent.style.display = 'none';
    });
  }
});

// Initialize display on window load as well
window.onload = function() {
  console.log('Window loaded');
  if (!localStorage.getItem("isLoggedIn")) {
    console.log('Ensuring login page is visible');
    showLogin();
  }
};

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-toggle i');
  
  if (body.hasAttribute('data-theme')) {
    // Switch to light theme
    body.removeAttribute('data-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('theme', 'light');
    
    // Update map style if map exists
    if (typeof map !== 'undefined' && map) {
      map.setOptions({ styles: [] });
    }
  } else {
    // Switch to dark theme
    body.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('theme', 'dark');
    
    // Update map style if map exists
    if (typeof map !== 'undefined' && map) {
      map.setOptions({ styles: DARK_MAP_STYLE });
    }
  }
}

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
});

// Sort restaurants
function sortRestaurants(sortBy) {
  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.value = sortBy;
  }
  
  // Get current filter
  const activeFilter = document.querySelector('.filter-chip.active');
  const filterTag = activeFilter ? activeFilter.textContent : 'All';
  
  // Re-filter with new sort
  filterRestaurants(filterTag, sortBy);
}

// Update filter function to include sorting
function filterRestaurants(tag, sortOption) {
  const filterChips = document.querySelectorAll('.filter-chip');
  
  // Update active class
  filterChips.forEach(chip => {
    if (chip.textContent === tag) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  
  const restaurantList = document.getElementById('restaurant-list');
  if (!restaurantList) return;
  
  restaurantList.innerHTML = '';
  
  // Filter restaurants
  let filteredRestaurants = restaurants;
  
  if (tag !== 'All') {
    filteredRestaurants = restaurants.filter(restaurant => {
      // Check if restaurant has the selected tag
      return restaurant.tags.some(t => t === tag) || 
             restaurant.cuisine === tag ||
             (tag === 'Deals' && restaurant.price === '$') ||
             (tag === 'Premium' && restaurant.price === '$$$');
    });
  }
  
  // Get sort option if not provided
  if (!sortOption) {
    const sortSelect = document.getElementById('sort-by');
    sortOption = sortSelect ? sortSelect.value : 'recommended';
  }
  
  // Sort restaurants
  switch (sortOption) {
    case 'rating':
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
      break;
    case 'delivery-time':
      filteredRestaurants.sort((a, b) => {
        const aTime = parseInt(a.deliveryTime.split('-')[0]);
        const bTime = parseInt(b.deliveryTime.split('-')[0]);
        return aTime - bTime;
      });
      break;
    case 'price-low':
      filteredRestaurants.sort((a, b) => {
        const aPrice = a.price.length;
        const bPrice = b.price.length;
        return aPrice - bPrice;
      });
      break;
    case 'price-high':
      filteredRestaurants.sort((a, b) => {
        const aPrice = a.price.length;
        const bPrice = b.price.length;
        return bPrice - aPrice;
      });
      break;
    default:
      // Recommended - no sorting needed
      break;
  }
  
  // Get favorites
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Display filtered restaurants
  if (filteredRestaurants.length === 0) {
    restaurantList.innerHTML = '<div class="no-results">No restaurants found</div>';
    return;
  }
  
  filteredRestaurants.forEach(restaurant => {
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant';
    restaurantCard.innerHTML = `
      <img src="${restaurant.logo}" alt="${restaurant.name}" class="restaurant-logo">
      <div class="restaurant-info">
        <div class="restaurant-header">
          <h3>${restaurant.name}</h3>
          <div class="rating">
            <i class="fas fa-star"></i> ${restaurant.rating}
        </div>
        </div>
        <div class="restaurant-meta">
          <span>${restaurant.cuisine}</span>
          <span>${restaurant.price}</span>
          <span>${restaurant.deliveryTime}</span>
      </div>
        <div class="restaurant-tags">
          ${restaurant.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
      <button class="favorite-btn ${favorites.includes(restaurant.id) ? 'active' : ''}" onclick="toggleFavorite(${restaurant.id}, event)">
        <i class="fas fa-heart"></i>
      </button>
    `;
    
    restaurantCard.addEventListener('click', () => {
      showRestaurantMenu(restaurant);
    });
    
    restaurantList.appendChild(restaurantCard);
  });
}

// Initialize sort dropdown
document.addEventListener('DOMContentLoaded', function() {
  const sortSelect = document.getElementById('sort-by');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortRestaurants(this.value);
    });
  }
});

// Add favorite functionality
function toggleFavorite(restaurantId, event) {
  // Stop event propagation to prevent opening the restaurant menu
  event.stopPropagation();
  
  // Get favorites from localStorage or initialize empty array
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Check if restaurant is already in favorites
  const index = favorites.indexOf(restaurantId);
  
  if (index === -1) {
    // Add to favorites
    favorites.push(restaurantId);
    event.target.classList.add('active');
    showToast('Restaurant added to favorites');
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    event.target.classList.remove('active');
    showToast('Restaurant removed from favorites');
  }
  
  // Save to localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update favorites tab if it's visible
  if (document.getElementById('favorites').classList.contains('active')) {
    showFavorites();
  }
}

// Show favorites
function showFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  if (!favoritesList) return;
  
  // Get favorites from localStorage
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Clear list
  favoritesList.innerHTML = '';
  
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<div class="no-results">You have no favorite restaurants yet</div>';
    return;
  }
  
  // Filter restaurants to show only favorites
  const favoriteRestaurants = restaurants.filter(restaurant => favorites.includes(restaurant.id));
  
  // Display favorite restaurants
  favoriteRestaurants.forEach(restaurant => {
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant';
    restaurantCard.innerHTML = `
      <img src="${restaurant.logo}" alt="${restaurant.name}" class="restaurant-logo">
      <div class="restaurant-info">
        <div class="restaurant-header">
          <h3>${restaurant.name}</h3>
          <div class="rating">
            <i class="fas fa-star"></i> ${restaurant.rating}
          </div>
        </div>
        <div class="restaurant-meta">
          <span>${restaurant.cuisine}</span>
          <span>${restaurant.price}</span>
          <span>${restaurant.deliveryTime}</span>
        </div>
        <div class="restaurant-tags">
          ${restaurant.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <button class="favorite-btn active" onclick="toggleFavorite(${restaurant.id}, event)">
        <i class="fas fa-heart"></i>
      </button>
    `;
    
    restaurantCard.addEventListener('click', () => {
      showRestaurantMenu(restaurant);
    });
    
    favoritesList.appendChild(restaurantCard);
  });
}

// Show toast notification
function showToast(message) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Cart functionality
function showCart() {
  // Create cart modal
  const cartModal = document.createElement('div');
  cartModal.className = 'cart-modal';
  cartModal.id = 'cart-modal';
  
  // Get cart items from localStorage
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Group items by restaurant
  const restaurantGroups = {};
  cart.forEach(item => {
    if (!restaurantGroups[item.restaurantId]) {
      restaurantGroups[item.restaurantId] = {
        name: item.restaurantName,
        items: []
      };
    }
    restaurantGroups[item.restaurantId].items.push(item);
  });
  
  // Calculate total
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + tax;
  
  // Create cart content
  cartModal.innerHTML = `
    <div class="cart-content">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="close-cart-btn" onclick="closeCart()">&times;</button>
      </div>
      <div id="cart-delivery-address">
        ${selectedAddress ? `Delivery to: ${selectedAddress}` : 'No delivery address selected'}
      </div>
      <div id="cart-list">
        ${cart.length === 0 ? 
          '<div class="empty-cart">Your cart is empty</div>' : 
          Object.values(restaurantGroups).map(group => `
            <div class="restaurant-group">
              <h3>${group.name}</h3>
              ${group.items.map((item, index) => `
                <div class="cart-item">
                  <div>
                    <h4>${item.itemName}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                  </div>
                  <button class="remove-item-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
              `).join('')}
            </div>
          `).join('')
        }
      </div>
      ${cart.length > 0 ? `
        <div class="cart-summary">
          <div>
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Delivery Fee</span>
            <span>$${deliveryFee.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="final-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
        <button class="checkout-btn" onclick="showCheckout()">Proceed to Checkout</button>
      ` : ''}
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(cartModal);
  
  // Show modal
  setTimeout(() => {
    cartModal.style.display = 'flex';
  }, 10);
  
  // Add event listener to close when clicking outside
  cartModal.addEventListener('click', function(event) {
    if (event.target === cartModal) {
      closeCart();
    }
  });
}

// Close cart modal
function closeCart() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.style.display = 'none';
    document.body.removeChild(cartModal);
  }
}

function showCheckout() {
  // Close the cart modal first
  closeCart();
  
  // Get the checkout modal
  const checkoutModal = document.getElementById('checkout-modal');
  
  // Populate checkout details
  const checkoutAddress = document.getElementById('checkout-address');
  const estimatedTime = document.getElementById('estimated-time');
  const checkoutItems = document.getElementById('checkout-items');
  
  // Set delivery address
  if (selectedAddress) {
    checkoutAddress.textContent = addresses[selectedAddress];
  } else {
    checkoutAddress.textContent = 'No delivery address selected';
  }
  
  // Set estimated delivery time (random between 30-45 minutes)
  const minTime = 30;
  const maxTime = 45;
  const deliveryTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  estimatedTime.textContent = `Estimated delivery time: ${deliveryTime} minutes`;
  
  // Group cart items by restaurant
  const restaurantGroups = {};
  cart.forEach(item => {
    if (!restaurantGroups[item.restaurantId]) {
      restaurantGroups[item.restaurantId] = {
        name: item.restaurantName,
        items: []
      };
    }
    restaurantGroups[item.restaurantId].items.push(item);
  });
  
  // Generate HTML for checkout items
  let checkoutItemsHTML = '';
  let subtotal = 0;
  
  Object.values(restaurantGroups).forEach(group => {
    checkoutItemsHTML += `
      <div class="restaurant-group">
        <h4>${group.name}</h4>
        ${group.items.map(item => {
          subtotal += item.price;
          return `
            <div class="checkout-item">
              <span>${item.itemName}</span>
              <span>$${item.price.toFixed(2)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  });
  
  // Calculate tax and total
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  // Add price summary
  checkoutItemsHTML += `
    <div class="price-summary">
      <div>
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div>
        <span>Tax (8%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  checkoutItems.innerHTML = checkoutItemsHTML;
  
  // Show the checkout modal
  checkoutModal.style.display = 'flex';
}

function closeCheckout() {
  const checkoutModal = document.getElementById('checkout-modal');
  checkoutModal.style.display = 'none';
}

// Modified processOrder function for GitHub Pages compatibility
function processOrder() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const instructions = document.getElementById('order-instructions').value;
  
  if (!selectedAddress) {
    alert('Please select a delivery address');
    return;
  }
  
  if (paymentMethod === 'card') {
    const cardNumber = document.querySelector('.card-input').value;
    const cardExpiry = document.querySelector('.card-input.small').value;
    const cardCvv = document.querySelectorAll('.card-input.small')[1].value;
    
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert('Please enter all card details');
      return;
    }
  }
  
  // Show processing state
  const checkoutBody = document.querySelector('.checkout-body');
  checkoutBody.innerHTML = `
    <div class="order-processing">
      <div class="loading-spinner"></div>
      <p>Processing your order...</p>
    </div>
  `;
  
  // Simulate processing delay
  setTimeout(() => {
    // Create order object
    const orderItems = Object.values(cart).flat();
    const orderTotal = calculateTotal();
    
    const order = {
      id: 'ORD' + Date.now(),
      items: orderItems,
      total: orderTotal,
      address: selectedAddress,
      paymentMethod: paymentMethod,
      instructions: instructions,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes from now
    };
    
    // Add to orders array
    if (!orders) orders = [];
    orders.push(order);
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = {};
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartIndicator();
    
    // Show success message
    checkoutBody.innerHTML = `
      <div class="order-success">
        <div class="success-icon">✓</div>
        <h3>Order Placed Successfully!</h3>
        <p>Your order #${order.id} has been confirmed.</p>
        <p>Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleTimeString()}</p>
        <button class="done-btn" onclick="closeCheckout(); showTab('orders');">View Orders</button>
      </div>
    `;
    
    if (isGitHubPages) {
      console.log('GitHub Pages demo: Order processed successfully', order);
    } else {
      // In a real app, send to server
      fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(order)
      }).catch(error => {
        console.error('Error saving order to server:', error);
      });
    }
  }, 2000);
}

function removeFromCart(index) {
  // Get cart items from localStorage
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Remove item
  cart.splice(index, 1);
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart indicator
  updateCartIndicator();
  
  // Refresh cart modal
  closeCart();
  showCart();
}

// Add event listener to cart button
document.addEventListener('DOMContentLoaded', function() {
  const cartBtn = document.getElementById('main-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', showCart);
  }
  
  // Initialize favorites
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
});

// Filter orders by type (all, active, past)
function filterOrders(filterType) {
  // Update active button
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  // Find the clicked button and add active class
  const clickedButton = Array.from(filterButtons).find(button => 
    button.textContent.toLowerCase().includes(filterType.toLowerCase())
  );
  
  if (clickedButton) {
    clickedButton.classList.add('active');
  }
  
  // Display filtered orders
  displayOrders(filterType);
}

// Display orders based on filter
function displayOrders(filterType) {
  // Get order containers
  const activeOrdersContainer = document.getElementById('active-orders');
  const orderHistoryContainer = document.getElementById('order-history');
  
  // Clear containers
  activeOrdersContainer.innerHTML = '';
  orderHistoryContainer.innerHTML = '';
  
  // If no orders, show message
  if (orders.length === 0) {
    const noOrdersMessage = `<div class="no-results">You have no orders yet</div>`;
    
    if (filterType === 'all' || filterType === 'active') {
      activeOrdersContainer.innerHTML = noOrdersMessage;
    }
    
    if (filterType === 'all' || filterType === 'past') {
      orderHistoryContainer.innerHTML = noOrdersMessage;
    }
    
    return;
  }
  
  // Filter orders
  const activeOrders = orders.filter(order => 
    order.status === 'confirmed' || order.status === 'preparing' || order.status === 'delivering'
  );
  
  const pastOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );
  
  // Display active orders if needed
  if ((filterType === 'all' || filterType === 'active') && activeOrders.length > 0) {
    activeOrdersContainer.innerHTML = `
      <h3>Active Orders</h3>
      ${activeOrders.map(order => createOrderCard(order)).join('')}
    `;
  } else if (filterType === 'all' || filterType === 'active') {
    activeOrdersContainer.innerHTML = `<div class="no-results">No active orders</div>`;
  }
  
  // Display past orders if needed
  if ((filterType === 'all' || filterType === 'past') && pastOrders.length > 0) {
    orderHistoryContainer.innerHTML = `
      <h3>Order History</h3>
      ${pastOrders.map(order => createOrderCard(order)).join('')}
    `;
  } else if (filterType === 'all' || filterType === 'past') {
    orderHistoryContainer.innerHTML = `<div class="no-results">No past orders</div>`;
  }
}

// Create order card HTML
function createOrderCard(order) {
  // Format date
  const orderDate = new Date(order.date);
  const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
  
  // Get status class
  let statusClass = '';
  switch(order.status) {
    case 'confirmed':
      statusClass = 'status-confirmed';
      break;
    case 'preparing':
      statusClass = 'status-preparing';
      break;
    case 'delivering':
      statusClass = 'status-delivering';
      break;
    case 'delivered':
      statusClass = 'status-delivered';
      break;
    case 'cancelled':
      statusClass = 'status-cancelled';
      break;
  }
  
  // Group items by restaurant
  const restaurantGroups = {};
  order.items.forEach(item => {
    if (!restaurantGroups[item.restaurantId]) {
      restaurantGroups[item.restaurantId] = {
        name: item.restaurantName,
        items: []
      };
    }
    restaurantGroups[item.restaurantId].items.push(item);
  });
  
  // Create order items HTML
  const orderItemsHTML = Object.values(restaurantGroups).map(group => `
    <div class="order-restaurant">
      <h4>${group.name}</h4>
      <div class="order-items">
        ${group.items.map(item => `
          <div class="order-item">
            <span>${item.itemName}</span>
            <span>$${item.price.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  // Return order card HTML
  return `
    <div class="order-card">
      <div class="order-header">
        <div>
          <h4>Order #${order.id.toString().slice(-6)}</h4>
          <p>${formattedDate}</p>
        </div>
        <div class="order-status ${statusClass}">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>
      <div class="order-content">
        <div class="order-items-container">
          ${orderItemsHTML}
        </div>
        <div class="order-details">
          <div class="order-total">
            <span>Total:</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
          <div class="order-address">
            <span>Delivery Address:</span>
            <span>${order.address}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Load saved data from localStorage
function loadSavedData() {
  // Load cart items
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartIndicator();
  }
  
  // Load addresses
  const savedAddresses = localStorage.getItem('addresses');
  if (savedAddresses) {
    addresses = JSON.parse(savedAddresses);
    loadAddresses();
  }
  
  // Load orders
  const savedOrders = localStorage.getItem('orders');
  if (savedOrders) {
    orders = JSON.parse(savedOrders);
  } else {
    // For GitHub Pages demo, create some sample orders
    if (isGitHubPages) {
      orders = [
        {
          id: 'ORD123456',
          items: [
            { name: 'Cheeseburger', price: 8.99, restaurant: 'Burger Palace' },
            { name: 'Fries', price: 3.99, restaurant: 'Burger Palace' }
          ],
          total: 12.98,
          address: '123 Main St, Anytown, USA',
          paymentMethod: 'card',
          status: 'delivered',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          estimatedDelivery: new Date(Date.now() - 84600000).toISOString()
        },
        {
          id: 'ORD789012',
          items: [
            { name: 'Pepperoni Pizza', price: 14.99, restaurant: 'Pizza Heaven' }
          ],
          total: 14.99,
          address: '123 Main St, Anytown, USA',
          paymentMethod: 'cash',
          status: 'preparing',
          timestamp: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 25 * 60000).toISOString() // 25 minutes from now
        }
      ];
      localStorage.setItem('orders', JSON.stringify(orders));
    } else {
      orders = [];
    }
  }
  
  // Load favorites
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  } else if (isGitHubPages) {
    // For GitHub Pages demo, set some sample favorites
    favorites = [0, 2]; // Favorite the first and third restaurants
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  
  // Set selected address
  const savedSelectedAddress = localStorage.getItem('selectedAddress');
  if (savedSelectedAddress) {
    selectedAddress = savedSelectedAddress;
    updateSelectedAddressDisplay();
  } else if (addresses && addresses.length > 0) {
    selectedAddress = addresses[0];
    updateSelectedAddressDisplay();
  } else if (isGitHubPages) {
    // For GitHub Pages demo, set a sample address
    selectedAddress = '123 Main St, Anytown, USA';
    addresses = [selectedAddress];
    localStorage.setItem('addresses', JSON.stringify(addresses));
    updateSelectedAddressDisplay();
    loadAddresses();
  }
  
  // Display restaurants
  displayRestaurants();
  
  // Display orders
  if (document.getElementById('orders')) {
    displayOrders('all');
  }
}

// Update selected address display
function updateSelectedAddressDisplay() {
  const addressDisplay = document.getElementById('selected-address-display');
  if (addressDisplay) {
    if (selectedAddress !== null && addresses && addresses[selectedAddress]) {
      addressDisplay.textContent = addresses[selectedAddress];
    } else {
      addressDisplay.textContent = 'Select delivery address';
    }
  }
}