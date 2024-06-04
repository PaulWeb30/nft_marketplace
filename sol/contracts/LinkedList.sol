// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract LinkedList {
    struct Node {
        bytes32 id;
        uint256 amount;
        uint256 pricePerOne;
        bytes32 next;
    }

    mapping(bytes32 => Node) public nodes;
    bytes32 public head;

    struct S {
        mapping(bytes32 => Node) nodes;
        bytes32 head;
    }

    /// @notice Adds a new node to the list
    /// @param id The id to be used as the node identifier
    /// @param amount The amount to be stored in the node
    /// @param pricePerOne The price to be stored in the node
    function addNode(bytes32 id, uint256 amount, uint256 pricePerOne) public {
        require(nodes[id].next == bytes32(0), "Node already exists");
        nodes[id] = Node({id: id, amount: amount, pricePerOne: pricePerOne, next: bytes32(0)});

        head = id;   
    }

    /// @notice Inserts a new node after a specified node
    /// @param insertAfterId The id of the node after which the new node will be inserted
    /// @param id The id to be used as the node identifier
    /// @param amount The amount to be stored in the node
    /// @param pricePerOne The price to be stored in the node
    function insertAfterNode(bytes32 insertAfterId, bytes32 id, uint256 amount, uint256 pricePerOne) public {
        require(nodes[id].next == bytes32(0), "Node already exists");
        if(insertAfterId != bytes32(0)) {
            require(nodes[insertAfterId].next != bytes32(0), "Insertion node does not exist");
        
            Node memory insertNode = nodes[insertAfterId];
            nodes[id] = Node({id: id, amount: amount,pricePerOne: pricePerOne, next: insertNode.next});
            nodes[insertAfterId].next = id;
        } else {
            addNode(id, amount, pricePerOne);
        }
    }

    /// @notice Retrieves a node's data and the next node's address
    /// @param id The id to be used as the node identifier
    /// @return The data and the next node's address
    function getNode(bytes32 id) public view returns (bytes32, uint256, uint256, bytes32) {
        Node memory node = nodes[id];
        return (node.id, node.amount, node.pricePerOne ,node.next);
    }

    /// @notice Updates a node's data
    /// @param id The id to be used as the node identifier
    /// @param newAmount The new data to be stored in the node
    function updateNodeData(bytes32 id, uint256 newAmount, uint256 newPricePerOne) public {
        require(nodes[id].pricePerOne != 0, "Node does not exist");
        nodes[id].amount = newAmount;
        nodes[id].pricePerOne = newPricePerOne;
    }

    /// @notice Removes a node from the list
    /// @param id The id to be used as the node identifier
    function removeNode(bytes32 id) public {
        require(nodes[id].id != bytes32(0), "Node with this ID does not exist");

        if (head == id) {
            head = nodes[id].next;
        } else {
            bytes32 prevNodeId = findPrevNodeId(id);
            require(prevNodeId != bytes32(0), "Previous node not found");
            nodes[prevNodeId].next = nodes[id].next;
        }

        delete nodes[id];
    }
    function findPrevNodeId(bytes32 _id) internal view returns (bytes32) {
        bytes32 currentNodeId = head;
        
        while (nodes[currentNodeId].next != _id) {
            currentNodeId = nodes[currentNodeId].next;
            if (currentNodeId == bytes32(0)) {
                return bytes32(0); 
            }
        }
        
        return currentNodeId;
    }
}
