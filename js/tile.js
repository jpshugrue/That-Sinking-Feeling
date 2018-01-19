class Tile {

  constructor(position, collides, size, color) {
    this.color = color;
    this.size = size;
    this.x = position[0];
    this.y = position[1];
    this.collides = collides;
  }

  render(context) {
    if (this.collides) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  inCollision(player) {
    // debugger
    return (this.collides && !(this.x >= player.x + player.size || this.x + this.size <= player.x
      || this.y >= player.y + player.size || this.y + this.size <= player.y));
  }

}

export default Tile;
