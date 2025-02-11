const { Card, Deck, Hand, compareHands } = require('./index');

describe("Card Class", () => {
  test("should return correct string representation", () => {
    const card = new Card('A', '♠');
    expect(card.toString()).toBe("A♠");
  });

  test("should return correct rank values", () => {
    expect(Card.getRankValue('A')).toBe(14);
    expect(Card.getRankValue('5')).toBe(5);
    expect(Card.getRankValue('A', true)).toBe(1); // low ace case
  });

  test("should return correct suit values", () => {
    expect(Card.getSuitValue('♠')).toBe(4);
    expect(Card.getSuitValue('♦')).toBe(1);
  });
});

describe("Deck Class", () => {
  test("should initialize with 52 cards", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);
  });

  test("should shuffle the deck", () => {
    const deck = new Deck();
    const firstCardBeforeShuffle = deck.cards[0].toString();
    deck.shuffle();
    const firstCardAfterShuffle = deck.cards[0].toString();
    expect(firstCardAfterShuffle).not.toBe(firstCardBeforeShuffle);
  });

  test("should draw the correct number of cards", () => {
    const deck = new Deck();
    const drawnCards = deck.draw(5);
    expect(drawnCards.length).toBe(5);
    expect(deck.cards.length).toBe(47);
  });
});

describe("Hand Class", () => {
  test("should recognize a Royal Flush", () => {
    const hand = new Hand([
      new Card('A', '♠'), 
      new Card('K', '♠'),
      new Card('Q', '♠'), 
      new Card('J', '♠'),
      new Card('T', '♠')
    ]);
    expect(hand.getTier().name).toBe("Royal Flush");
  });

  test("should recognize a Straight Flush", () => {
    const hand = new Hand([
      new Card('9', '♥'), 
      new Card('8', '♥'),
      new Card('7', '♥'), 
      new Card('6', '♥'),
      new Card('5', '♥')
    ]);
    expect(hand.getTier().name).toBe("Straight Flush");
  });

  test("should recognize a Four of a Kind", () => {
    const hand = new Hand([
      new Card('9', '♠'), 
      new Card('9', '♥'),
      new Card('9', '♦'), 
      new Card('9', '♣'),
      new Card('K', '♠')
    ]);
    expect(hand.getTier().name).toBe("Four of a kind");
  });

  test("should recognize a Full House", () => {
    const hand = new Hand([
      new Card('Q', '♠'), 
      new Card('Q', '♥'),
      new Card('Q', '♦'), 
      new Card('7', '♣'),
      new Card('7', '♠')
    ]);
    expect(hand.getTier().name).toBe("Full house");
  });

  test("should recognize a Flush", () => {
    const hand = new Hand([
      new Card('A', '♣'), 
      new Card('T', '♣'),
      new Card('6', '♣'), 
      new Card('4', '♣'),
      new Card('2', '♣')
    ]);
    expect(hand.getTier().name).toBe("Flush");
  });

  test("should recognize a Straight", () => {
    const hand = new Hand([
      new Card('5', '♠'), 
      new Card('4', '♦'),
      new Card('3', '♣'), 
      new Card('2', '♥'),
      new Card('A', '♠')
    ]);
    expect(hand.getTier().name).toBe("Straight");
  });

  test("should recognize a Three of a Kind", () => {
    const hand = new Hand([
      new Card('7', '♠'), 
      new Card('7', '♦'),
      new Card('7', '♣'), 
      new Card('2', '♥'),
      new Card('A', '♠')
    ]);
    expect(hand.getTier().name).toBe("Three of a kind");
  });

  test("should recognize a Two Pair", () => {
    const hand = new Hand([
      new Card('8', '♦'),
      new Card('8', '♠'), 
      new Card('3', '♣'), 
      new Card('3', '♥'),
      new Card('K', '♠')
    ]);
    expect(hand.getTier().name).toBe("Two pair");
  });

  test("should recognize a One Pair", () => {
    const hand = new Hand([
      new Card('Q', '♣'), 
      new Card('Q', '♠'), 
      new Card('A', '♦'),
      new Card('3', '♥'),
      new Card('T', '♠')
    ]);
    expect(hand.getTier().name).toBe("One pair");
  });

  test("should recognize a High Card", () => {
    const hand = new Hand([
      new Card('J', '♣'), 
      new Card('5', '♠'), 
      new Card('3', '♦'),
      new Card('9', '♥'),
      new Card('2', '♠')
    ]);
    expect(hand.getTier().name).toBe("High card");
  });
});

describe("Hand Comparison", () => {
  test("should determine the correct winner", () => {
    // Royal Flush
    const playerCard = [
      new Card('A', '♠'), 
      new Card('K', '♠'),
      new Card('Q', '♠'), 
      new Card('J', '♠'),
      new Card('T', '♠')
    ];

    // Straight Flush
    const opponentCard = [
      new Card('9', '♥'), 
      new Card('8', '♥'),
      new Card('7', '♥'), 
      new Card('6', '♥'),
      new Card('5', '♥')
    ];

    const result = compareHands(playerCard, opponentCard);
    expect(result.message).toBe("You win! You got: Royal Flush, and your opponent got: Straight Flush");
  });
});
