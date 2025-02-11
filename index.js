const readline = require('readline')

// init prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// create card class
class Card {
  constructor(rank, suit) {
    this.rank = rank
    this.suit = suit
  }

  // translating cards to string. note: T = 10
  toString() {
    return `${this.rank === 'T' ? '10' : this.rank}${this.suit}`
  }

  // translating suites value
  static getSuitValue(suit) {
    const suitValue = {
      '♠': 4, 
      '♥': 3, 
      '♣': 2, 
      '♦': 1, 
    }

    return suitValue[suit]
  }

  // translating ranks value
  static getRankValue(rank, isLowAce = false) {
    const rankValue = {
      '2': 2, 
      '3': 3, 
      '4': 4, 
      '5': 5, 
      '6': 6, 
      '7': 7, 
      '8': 8, 
      '9': 9, 
      'T': 10, 
      'J': 11, 
      'Q': 12, 
      'K': 13, 
      'A': isLowAce ? 1 : 14,
    }

    return rankValue[rank]
  }
}

// create deck class
class Deck {
  constructor() {
    this.cards = []

    // define the ranks and suits
    const suits = ['♠', '♣', '♥', '♦']
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

    // create all cards
    for(let suit of suits) {
      for(let rank of ranks) {
        this.cards.push(new Card(rank, suit))
      }
    }

    // then shuffle all cards
    this.shuffle()
  }

  // shuffling cards
  shuffle() {
    for(let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let currCard = this.cards[i]
      let newCard = this.cards[j]

      // swap card position
      this.cards[i] = newCard
      this.cards[j] = currCard
    }
  }

  // drawing cards
  draw(x) {
    return this.cards.splice(0, x)
  }
}

// create hand class
class Hand {
  constructor(cards) {
    this.cards = cards
  }

  // define tiers
  getTier() {
    if(this.isRoyalFlush()) {
      return {
        tier: 10,
        name: 'Royal Flush',
      }
    }

    if(this.isStraightFlush()) {
      return {
        tier: 9,
        name: 'Straight Flush',
      }
    }

    if(this.isFourOfAKind()) {
      return {
        tier: 8,
        name: 'Four of a kind',
      }
    }

    if(this.isFullHouse()) {
      return {
        tier: 7,
        name: 'Full house',
      }
    }

    if(this.isFlush()) {
      return {
        tier: 6,
        name: 'Flush',
      }
    }

    if(this.isStraight()) {
      return {
        tier: 5,
        name: 'Straight',
      }
    }

    if(this.isThreeOfAKind()) {
      return {
        tier: 4,
        name: 'Three of a kind',
      }
    }

    if(this.isTwoPair()) {
      return {
        tier: 3,
        name: 'Two pair',
      }
    }

    if(this.isOnePair()) {
      return {
        tier: 2,
        name: 'One pair',
      }
    }

    return {
      tier: 1,
      name: 'High card',
    }
  }

  // get rank counts: to get current total ranks from a hand
  getRankCounts() {
    let counts = {}

    for(let card of this.cards) {
      counts[card.rank] = (counts[card.rank] || 0) + 1
    }

    return counts
  }

  // set rules for royal flush: 10, J, Q, K, A
  isRoyalFlush() {
    return this.isFlush() && 
      this.cards.some(card => card.rank === 'T') && 
      this.cards.some(card => card.rank === 'J') && 
      this.cards.some(card => card.rank === 'Q') && 
      this.cards.some(card => card.rank === 'K') && 
      this.cards.some(card => card.rank === 'A')
  }

  // set rules for straight flush: straight & flush
  isStraightFlush() {
    return this.isStraight() && this.isFlush()
  }

  // set rules for 4 of a kind: count = 4
  isFourOfAKind() {
    let counts = this.getRankCounts()

    // search any values = 4
    return Object.values(counts).includes(4)
  }

  // set rules for full house: count = 3 + 2
  isFullHouse() {
    let counts = this.getRankCounts()

    // search any values = 4
    return Object.values(counts).includes(3) && Object.values(counts).includes(2)
  }

  // set rules for flush: all same suit
  isFlush() {
    return new Set(this.cards.map(card => card.suit)).size === 1
  }

  // set rules for straight
  isStraight() {
    // define straight ranks
    const rankSeq = [
      '23456789TJQKA',  // for normal sequence
      'A2345',          // special request: low straight
    ]

    // get set ranks
    let cardRanks = this.cards.map(card => card.rank)

    // 1. check if all ranks are in total 5
    if(new Set(cardRanks).size !== 5)
      return false

    // sort all cards
    cardRanks.sort((a, b) => rankSeq[0].indexOf(a) - rankSeq[0].indexOf(b))

    // join the cards
    let handStr = cardRanks.join('')

    // special case: A2345
    if(handStr === '2345A') {
      // reorder the hand
      handStr = 'A2345'
    }

    // 2. find out the sequence
    for(let seq of rankSeq) {
      // if hand is in inclusion, return true
      if(seq.includes(handStr))
        return true
    }

    // do return false if the hands not okay
    return false
  }

  // set rules for 3 of a kind: count = 3
  isThreeOfAKind() {
    let counts = this.getRankCounts()

    // search any values = 3
    return Object.values(counts).includes(3)
  }

  // set rules for 2 pairs: count = 2 -> 2x
  isTwoPair() {
    let counts = this.getRankCounts()

    // search any values = 3
    return Object.values(counts).filter(count => count === 2).length === 2
  }

  // set rules for 1 pair: count = 2
  isOnePair() {
    let counts = this.getRankCounts()

    // search any values = 2
    return Object.values(counts).includes(2)
  }

  // set rules for getting high card
  getHighCardValue() {
    // define variable
    let isLowAce = 0

    if(this.cards.some(card => card.rank === 'A') && this.cards.some(card => card.rank === '2') && this.cards.some(card => card.rank === '3') && this.cards.some(card => card.rank === '4') && this.cards.some(card => card.rank === '5')) {
      isLowAce = 1
    }
    
    // sort all cards by rank, then suit
    return [...this.cards].sort((a, b) => {
      // count occurrences of each rank in the hand
      let rankCounts = this.cards.reduce((counts, card) => {
        counts[card.rank] = (counts[card.rank] || 0) + 1
        return counts
      }, {})

      // then, compare by frequency of rank
      let freqDiff = rankCounts[b.rank] - rankCounts[a.rank]
      if(freqDiff !== 0) 
        return freqDiff

      // then, compare by rank first
      let rankDiff = Card.getRankValue(b.rank, isLowAce) - Card.getRankValue(a.rank, isLowAce)
      if(rankDiff !== 0)
        return rankDiff

      // last, compare by suit
      return Card.getSuitValue(b.suit) - Card.getSuitValue(a.suit)
    })
  }
}

// compare both hands
function compareHands(pl1Cards, npcCards) {
  // create each hands
  let pl1Hand = new Hand(pl1Cards)
  let npcHand = new Hand(npcCards)

  // get tier each hand
  let pl1Tier = pl1Hand.getTier()
  let npcTier = npcHand.getTier()

  // winner = player, if player tier is higher than the system
  if(pl1Tier.tier > npcTier.tier) {
    return {
      message: `You win! You got: ${pl1Tier.name}, and your opponent got: ${npcTier.name}`
    }
  }
  // winner = system, if player tier is lower than the system
  else if(pl1Tier.tier < npcTier.tier) {
    return {
      message: `You lose! Your opponent got: ${npcTier.name}, but you got: ${pl1Tier.name}`
    }
  }
  // evaluate each cards if both players have same tier
  else {
    // sorted hand
    let pl1HandSort = pl1Hand.getHighCardValue()
    let npcHandSort = npcHand.getHighCardValue()

    // define variables
    let winner = ''
    let pl1CurrRank = pl1HandSort[0].rank === 'T' ? '10' : pl1HandSort[0].rank
    let pl1CurrSuit = pl1HandSort[0].suit
    let npcCurrRank = npcHandSort[0].rank === 'T' ? '10' : npcHandSort[0].rank
    let npcCurrSuit = npcHandSort[0].suit

    // for most cases (excluding all types of flushes), compare rank first, then suit
    if(pl1Tier.name !== 'Flush' && pl1Tier.name !== 'Straight Flush') {
      // compare rank
      if(pl1HandSort[0].rank !== npcHandSort[0].rank) {
        // winner = player, if player rank is higher than the system
        if(Card.getRankValue(pl1HandSort[0].rank) > Card.getRankValue(npcHandSort[0].rank)) {
          winner = 'pl1'
        }
        // winner = system, if player rank is lower than the system
        else if(Card.getRankValue(pl1HandSort[0].rank) < Card.getRankValue(npcHandSort[0].rank)) {
          winner = 'npc'
        }
      }
      // compare suit
      else if(pl1HandSort[0].suit !== npcHandSort[0].suit) {
        // winner = player, if player suit is higher than the system
        if(Card.getSuitValue(pl1HandSort[0].suit) > Card.getSuitValue(npcHandSort[0].suit)) {
          winner = 'pl1'
        }
        // winner = system, if player suit is lower than the system
        else if(Card.getSuitValue(pl1HandSort[0].suit) < Card.getSuitValue(npcHandSort[0].suit)) {
          winner = 'npc'
        }
      }
    }
    // if flush, compare suit first, then rank
    else {
      // compare suit
      if(pl1HandSort[0].suit !== npcHandSort[0].suit) {
        // winner = player, if player suit is higher than the system
        if(Card.getSuitValue(pl1HandSort[0].suit) > Card.getSuitValue(npcHandSort[0].suit)) {
          winner = 'pl1'
        }
        // winner = system, if player suit is lower than the system
        else if(Card.getSuitValue(pl1HandSort[0].suit) < Card.getSuitValue(npcHandSort[0].suit)) {
          winner = 'npc'
        }
      }
      // compare rank
      else if(pl1HandSort[0].rank !== npcHandSort[0].rank) {
        // winner = player, if player rank is higher than the system
        if(Card.getRankValue(pl1HandSort[0].rank) > Card.getRankValue(npcHandSort[0].rank)) {
          winner = 'pl1'
        }
        // winner = system, if player rank is lower than the system
        else if(Card.getRankValue(pl1HandSort[0].rank) < Card.getRankValue(npcHandSort[0].rank)) {
          winner = 'npc'
        }
      }
    }

    // message for winner = player
    if(winner === 'pl1') {
      return {
        message: `You win! Both got: ${pl1Tier.name}, and your top card (${pl1CurrRank}${pl1CurrSuit}) beats your opponent's top card (${npcCurrRank}${npcCurrSuit})`
      }
    }

    // message for winner = player
    if(winner === 'npc') {
      return {
        message: `You lose! Both got: ${pl1Tier.name}, but your top card (${pl1CurrRank}${pl1CurrSuit}) lost to your opponent's top card (${npcCurrRank}${npcCurrSuit})`
      }
    }
  }
}

// =============================================================
// main function
function playPoker() {
  // create prompt
  console.log('\nWelcome to Poker game!\n')
  rl.question('\nPress Enter to draw your cards...', async () => {
    // as long as its running, do loop
    while(true) {
      // init deck and shuffle
      const deck = new Deck()
  
      // shuffle the deck once again
      deck.shuffle()

      try {
        // draw cards for player, then for system
        let pl1Cards = deck.draw(5)
        let npcCards = deck.draw(5)

        // display each hands
        console.log('\nYour hand:', pl1Cards.map(card => card.toString()).join(' '))
        console.log('Computer\'s hand:', npcCards.map(card => card.toString()).join(' '))

        // compare hands
        let res = compareHands(pl1Cards, npcCards)

        // display result
        console.log(res.message)
      }
      catch(e) {
        console.log('\nError:', e.message)
        console.log('Starting new round with fresh deck...\n')
        break
      }

      // create question
      let answer = await new Promise(resolve => {
        rl.question('\nPlay again? (y/n): ', resolve)
      })

      // if no, then the game stops
      if(answer.toLowerCase() !== 'y') {
        console.log('\nThanks for playing!\n')
        setTimeout(() => {
          rl.close()
        }, 2000)
        break
      }

      console.log('\n-------------------\n')
    }
  })
}

// run the game
playPoker()

// =================================================================
module.exports = { 
  Card, 
  Hand, 
  Deck,
  compareHands,
}