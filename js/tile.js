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

  // inCollision(tile) {
  //   return (this.x + this.size <= tile.x || this.x >= tile.x + tile.size
  //     || this.y + this.size <= tile.y || this.y >= tile.y + tile.size);
  // }

}

export default Tile;
