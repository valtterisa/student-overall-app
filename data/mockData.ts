export type University = {
    id: number;
    name: string;
    city: string;
    fieldOfStudy: string;
    trouserColor: string;
    imageUrl: string;
  };
  
  export const universities: University[] = [
    {
      id: 1,
      name: "Tech University",
      city: "Silicon Valley",
      fieldOfStudy: "Computer Science",
      trouserColor: "Navy",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Arts Academy",
      city: "Paris",
      fieldOfStudy: "Fine Arts",
      trouserColor: "Black",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Business School",
      city: "New York",
      fieldOfStudy: "Finance",
      trouserColor: "Gray",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Medical Institute",
      city: "London",
      fieldOfStudy: "Medicine",
      trouserColor: "White",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Engineering College",
      city: "Tokyo",
      fieldOfStudy: "Mechanical Engineering",
      trouserColor: "Navy",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Law School",
      city: "Washington D.C.",
      fieldOfStudy: "Law",
      trouserColor: "Black",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      name: "Environmental Studies University",
      city: "Vancouver",
      fieldOfStudy: "Environmental Science",
      trouserColor: "Green",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      name: "Culinary Institute",
      city: "Rome",
      fieldOfStudy: "Culinary Arts",
      trouserColor: "White",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ];
  
  export const trouserColors = Array.from(new Set(universities.map(u => u.trouserColor)));
  export const cities = Array.from(new Set(universities.map(u => u.city)));
  export const fieldsOfStudy = Array.from(new Set(universities.map(u => u.fieldOfStudy)));
  
  export const colorPalette = [
    { main: 'Red', shades: ['Light Red', 'Red', 'Dark Red'] },
    { main: 'Blue', shades: ['Light Blue', 'Blue', 'Dark Blue'] },
    { main: 'Green', shades: ['Light Green', 'Green', 'Dark Green'] },
    { main: 'Yellow', shades: ['Light Yellow', 'Yellow', 'Dark Yellow'] },
    { main: 'Purple', shades: ['Light Purple', 'Purple', 'Dark Purple'] },
    { main: 'Orange', shades: ['Light Orange', 'Orange', 'Dark Orange'] },
    { main: 'Pink', shades: ['Light Pink', 'Pink', 'Dark Pink'] },
    { main: 'Brown', shades: ['Light Brown', 'Brown', 'Dark Brown'] },
    { main: 'Gray', shades: ['Light Gray', 'Gray', 'Dark Gray'] },
    { main: 'Black', shades: ['Black'] },
    { main: 'White', shades: ['White'] },
  ];
  
  export const allColors = colorPalette.flatMap(color => color.shades);
  
  