#include <cstdint>

extern "C" {
  void mirrorImage(int width, int height, uint8_t* imageData) {
    for (int y = 0; y < height; ++y) {
      int left = 0;
      int right = width - 1;
      while (left < right) {
        for (int i = 0; i < 4; ++i) {
          uint8_t temp = imageData[(y * width + left) * 4 + i];
          imageData[(y * width + left) * 4 + i] = imageData[(y * width + right) * 4 + i];
          imageData[(y * width + right) * 4 + i] = temp;
        }
        ++left;
        --right;
      }
    }
  }
}
 