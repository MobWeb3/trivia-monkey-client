export const GeneralTopics = {
    Geography: "Geography",
    History: "History",
    Music: "Music",
    Sports: "Sports",
    GeneralKnowledge: "General knowledge",
    Film: "Film",
    Literature: "Literature",
    Mathematics: "Mathematics",
    Religion: "Religion",
    PopularCulture: "Popular culture",
    DisneyTrivia: "Disney Trivia",
    Art: "Art",
    ChristmasTrivia: "Christmas trivia",
    Education: "Education",
    BakingTrivia: "Baking trivia",
    CasinoTrivia: "Casino trivia",
    Infant: "Infant",
    ComedyTrivia: "Comedy trivia",
    ClassicRockTrivia: "Classic rock trivia",
    Biology: "Biology",
    Astronomy: "Astronomy",
    BatmanTrivia: "Batman trivia",
    Trivia1980s: "1980s trivia"
}

const questionsPerPlayer = {
    1: 6, // The only player can choose 6 topic questions
    2: 3, // Each player chooses 3 topic questions
    3: 2, // Each player chooses 2 topic questions
    4: 1, // Each player chooses 1 topic question, the rest is chosen randomly
    5: 1,
    6: 1,
  };
  
  export const numberOfQuestionPlayerCanChoose = (numberPlayers: number) => {
    return questionsPerPlayer[numberPlayers as keyof typeof questionsPerPlayer] || 0;
}