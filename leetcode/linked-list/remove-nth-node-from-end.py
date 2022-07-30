# https://leetcode.com/problems/remove-nth-node-from-end-of-list/


# Definition for singly-linked list.

from typing import Optional

from list_node import ListNode


class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        fast = slow = head
        for _ in range(n):
            fast = fast.next
        if not fast:
            return head.next
        while fast.next:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return head


solution = Solution()
assert solution.removeNthFromEnd(
    ListNode(1, ListNode(2, ListNode(3, ListNode(4)))), 2) == \
    ListNode(1, ListNode(2, ListNode(4)))
assert solution.removeNthFromEnd(
    ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5))))), 2) == \
    ListNode(1, ListNode(2, ListNode(3, ListNode(5))))
assert solution.removeNthFromEnd(ListNode(1), 1) == None
assert solution.removeNthFromEnd(ListNode(1, ListNode(2)), 1) == ListNode(1)
print("== done ==")
