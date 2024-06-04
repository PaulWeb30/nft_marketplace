// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

library LinkedListLib {
    struct Node {
        bytes32 id;
        uint256 amount;
        uint256 pricePerOne;
        bytes32 next;
    }

	struct Storage {
		mapping(bytes32 => Node) nodes;
		bytes32 head;
	}
    

    /// @notice Adds a new node to the list
    /// @param id The id to be used as the node identifier
    /// @param amount The amount to be stored in the node
    /// @param pricePerOne The price to be stored in the node
    function addNode(Storage storage S, bytes32 id, uint256 amount, uint256 pricePerOne) internal {
        require(S.nodes[id].next == bytes32(0), "Node already exists");
        S.nodes[id] = Node({id: id, amount: amount, pricePerOne: pricePerOne, next: bytes32(0)});

        S.head = id;   
    }

    /// @notice Inserts a new node after a specified node
    /// @param insertAfterId The id of the node after which the new node will be inserted
    /// @param id The id to be used as the node identifier
    /// @param amount The amount to be stored in the node
    /// @param pricePerOne The price to be stored in the node
    function insertAfterNode(Storage storage S, bytes32 insertAfterId, bytes32 id, uint256 amount, uint256 pricePerOne) internal {
        require(S.nodes[id].next == bytes32(0), "Node already exists");
        if(insertAfterId != bytes32(0)) {
            require(S.nodes[insertAfterId].next != bytes32(0), "Insertion node does not exist");
        
            Node memory insertNode = S.nodes[insertAfterId];
            S.nodes[id] = Node({id: id, amount: amount,pricePerOne: pricePerOne, next: insertNode.next});
            S.nodes[insertAfterId].next = id;
        } else {
            addNode(S, id, amount, pricePerOne);
        }
    }

    /// @notice Retrieves a node's data and the next node's address
    /// @param id The id to be used as the node identifier
    /// @return The data and the next node's address
    function getNode(Storage storage S, bytes32 id) internal view returns (bytes32, uint256, uint256, bytes32) {
        Node memory node = S.nodes[id];
        return (node.id, node.amount, node.pricePerOne ,node.next);
    }

    /// @notice Updates a node's data
    /// @param id The id to be used as the node identifier
    /// @param newAmount The new data to be stored in the node
    function updateNodeData(Storage storage S, bytes32 id, uint256 newAmount, uint256 newPricePerOne) internal {
        require(S.nodes[id].pricePerOne != 0, "Node does not exist");
        S.nodes[id].amount = newAmount;
        S.nodes[id].pricePerOne = newPricePerOne;
    }

    /// @notice Removes a node from the list
    /// @param id The id to be used as the node identifier    /// @notice Removes a node from the list
    /// @param id The id to be used as the node identifier
    function removeNode(Storage storage S, bytes32 id) internal {
        require(S.nodes[id].id != bytes32(0), "Node with this ID does not exist");

        if (S.head == id) {
            S.head = S.nodes[id].next;
        } else {
            bytes32 prevNodeId = findPrevNodeId(S, id);
            require(prevNodeId != bytes32(0), "Previous node not found");
            S.nodes[prevNodeId].next = S.nodes[id].next;
        }

        delete S.nodes[id];
    }

    function findPrevNodeId(Storage storage S, bytes32 _id) internal view returns (bytes32) {
        bytes32 currentNodeId = S.head;
        
        while (S.nodes[currentNodeId].next != _id) {
            currentNodeId = S.nodes[currentNodeId].next;
            if (currentNodeId == bytes32(0)) {
                return bytes32(0); 
            }
        }
        
        return currentNodeId;
    }
	function getHead(Storage storage S) internal view returns(bytes32) {
		return S.head;
	}
}
