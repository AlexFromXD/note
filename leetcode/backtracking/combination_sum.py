# https://leetcode.com/problems/combination-sum/


from typing import List


class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        ret = []
        self._dfs(candidates, target, [], ret)
        return ret

    def _dfs(self, nums, target, path, ret):
        if target < 0:
            return
        if target == 0:
            ret.append(path)
            return
        for i in range(len(nums)):
            self._dfs(nums[i:], target-nums[i], path+[nums[i]], ret)


solution = Solution()
assert solution.combinationSum([3], 9) == [[3, 3, 3]]
assert solution.combinationSum([2, 3, 6, 7], 7) == [[2, 2, 3], [7]]
assert solution.combinationSum([2, 3, 5], 8) == [
    [2, 2, 2, 2], [2, 3, 3], [3, 5]]
assert solution.combinationSum([2], 1) == []
print("== done ==")
