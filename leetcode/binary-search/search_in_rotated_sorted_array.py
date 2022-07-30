# https://leetcode.com/problems/search-in-rotated-sorted-array/

from typing import List


class Solution:
    def search(self, nums: List[int], target: int) -> int:
        if not nums:
            return -1

        low, high = 0, len(nums) - 1

        while low <= high:
            mid = int((low + high) / 2)

            if target == nums[mid]:
                return mid

            if nums[low] <= nums[mid]:
                if nums[low] <= target <= nums[mid]:
                    high = mid - 1
                else:
                    low = mid + 1
            else:
                if nums[mid] <= target <= nums[high]:
                    low = mid + 1
                else:
                    high = mid - 1

        return -1


solution = Solution()
assert solution.search([4, 5, 6, 7, 0, 1, 2], 0) == 4
assert solution.search([6, 7, 0, 1, 2, 4, 5], 0) == 2
assert solution.search([4, 5, 6, 7, 0, 1, 2], 3) == -1
assert solution.search([1], 0) == -1
print("== done ==")
