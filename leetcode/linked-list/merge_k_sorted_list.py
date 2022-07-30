# https://leetcode.com/problems/merge-k-sorted-lists/

from typing import List, Optional

from list_node import ListNode


class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists:
            return None
        if len(lists) == 1:
            return lists[0]
        mid = len(lists) // 2
        l, r = self.mergeKLists(lists[:mid]), self.mergeKLists(lists[mid:])
        return self._merge(l, r)

    def _merge(self, l: ListNode, r: ListNode):
        dummy = p = ListNode()
        while l and r:
            if l.val < r.val:
                p.next = l
                l = l.next
            else:
                p.next = r
                r = r.next
            p = p.next
        p.next = l or r
        return dummy.next

    # def _merge1(self, l, r):
    #     if not l or not r:
    #         return l or r
    #     if l.val < r.val:
    #         l.next = self._merge(l.next, r)
    #         return l
    #     r.next = self._merge(l, r.next)
    #     return r


solution = Solution()
assert solution.mergeKLists(
    [ListNode(1, ListNode(4, ListNode(5))), ListNode(1, ListNode(3, ListNode(4))), ListNode(2, ListNode(6))]) == \
    ListNode(1, ListNode(1, ListNode(2, ListNode(
        3, ListNode(4, ListNode(4, ListNode(5, ListNode(6))))))))
assert solution.mergeKLists([]) is None
