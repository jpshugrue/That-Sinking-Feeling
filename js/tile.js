class Tile {

  constructor(position, collides, size, image) {
    this.image = image;
    this.size = size;
    this.x = position[0];
    this.y = position[1];
    this.collides = collides;
  }

  render(context) {
    if (this.collides) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  inCollision(player) {
    return (this.collides && !(this.x >= player.x + player.size || this.x + this.size <= player.x
      || this.y >= player.y + player.size || this.y + this.size <= player.y));
  }

}

export default Tile;
