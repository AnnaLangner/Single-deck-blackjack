const assert = require('assert').strict;
import {cardValueMapping, getScore} from '../src/utilsFunctions';

describe('testedScript', () => {
  describe('cardValueMapping', () => {
    it('should return 2', () => {
      const actual = cardValueMapping('JACK');
      const expected = 2;

      assert.strictEqual(actual, expected);
    });
    it('should return 3', () => {
      const actual = cardValueMapping('QUEEN');
      const expected = 3;

      assert.strictEqual(actual, expected);
    });
    it('should return 4', () => {
      const actual = cardValueMapping('KING');
      const expected = 4;

      assert.strictEqual(actual, expected);
    });
    it('should return 11', () => {
      const actual = cardValueMapping('ACE');
      const expected = 11;

      assert.strictEqual(actual, expected);
    });
  });
  describe('getScore', () => {
    it('should return player win, when player has double Ace', () => {
      const actual = getScore(true, 'Test', 22, 18);
      const expected = 'Test win!';

      assert.strictEqual(actual, expected);
    });
    it('should return player lost game, when player has equal or more than 22 points', () => {
      const actual = getScore(false, 'Test', 22, 18);
      const expected = 'lost game';
      
      assert.strictEqual(actual, expected);
    });
    it('should return player win, when player has equal 21 points', () => {
      const actual = getScore(false, 'Test', 21, 18);
      const expected = 'Test win!';
      
      assert.strictEqual(actual, expected);
    });
    it('should return player win, when player has less points than dealer and dealer score is higher than 22', () => {
      const actual = getScore(false, 'Test', 18, 23);
      const expected = 'Test win!';
      
      assert.strictEqual(actual, expected);
    });
    it('should return player lost game, when player has less points than dealer and dealer score is lower than 22', () => {
      const actual = getScore(false, 'Test', 18, 20);
      const expected = 'lost game';
      
      assert.strictEqual(actual, expected);
    });
    it('should return player win, when player has more points than dealer and player score is lower than 22', () => {
      const actual = getScore(false, 'Test', 20, 18);
      const expected = 'Test win!';
      
      assert.strictEqual(actual, expected);
    });
    it('should return push, when player and dealer has equals score', () => {
      const actual = getScore(false, 'Test', 20, 20);
      const expected = 'Push';
      
      assert.strictEqual(actual, expected);
    });
    it('should return player lost game, when player has 0 points and dealer score is higher than 21', () => {
      const actual = getScore(false, 'Test', 0, 25);
      const expected = 'lost game';
      
      assert.strictEqual(actual, expected);
    });
  })
});
