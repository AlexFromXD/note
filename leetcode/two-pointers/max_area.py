# https://leetcode.com/problems/container-with-most-water/

from typing import List


class Solution:
    def maxArea(self, height: List[int]) -> int:
        left = 0
        right = len(height) - 1
        max_volume = 0

        while (right > left):
            volume = min(height[left], height[right]) * (right - left)
            max_volume = max(volume, max_volume)

            if height[left] < height[right]:
                left += 1
            else:
                right -= 1

        return max_volume


solution = Solution()
assert solution.maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
assert solution.maxArea([1, 1]) == 1
print("== done ==")
