# https://leetcode.com/problems/combination-sum-ii/


from typing import List


class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        ret = []
        self._dfs(candidates, target, [], ret)
        return ret

    # def _dfs(self, nums, target, path, ret):
    #     if target < 0:
    #         return
    #     if target == 0:
    #         ret.append(path)
    #         return
    #     for i in range(len(nums)):
    #         self._dfs(nums[i:], target-nums[i], path+[nums[i]], ret)


solution = Solution()
assert solution.combinationSum([10, 1, 2, 7, 6, 1, 5], 8) == [
    [1, 1, 6],
    [1, 2, 5],
    [1, 7],
    [2, 6]
]
assert solution.combinationSum([2, 5, 2, 1, 2], 5) == [
    [1, 2, 2],
    [5]
]

print("== done ==")
