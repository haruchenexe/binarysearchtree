// it should have the attribute for data it stores on the left and right children
class Node {
    constructor(data) {
        this.data = data;
        this.leftChild = null;
        this.rightChild = null;
    }
}

let sampleArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

class Tree {
    // set the root to the midpoint of the binary search tree
    constructor(data) {
        this.root = this.buildTree(data);
    }

    buildTree(array) {

        const sortedArray = this.removeDuplicatesandSort(array);

        // set start & end point 
        const start = 0;
        const end = sortedArray.length-1;

        if (start > end) return null
    
        // find the index midpoint of the array and set it as the root
        const midpoint = Math.floor((start + end) / 2);
        const root = new Node(sortedArray[midpoint]);

    
        // recursively run the function again for leftChild & rightChild
        root.leftChild = this.buildTree(sortedArray.slice(0, midpoint));
        root.rightChild = this.buildTree(sortedArray.slice(midpoint+1, end));

        return root
        
    }


    removeDuplicatesandSort(array) {

        const uniquesortedarray = [...new Set(array)].sort((a,b) => a-b)
        return uniquesortedarray

    }


    prettyPrint = (node = this.root, prefix = '', isLeft = true) => {
        if (node.rightChild !== null) {
          this.prettyPrint(node.rightChild, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
        if (node.leftChild !== null) {
          this.prettyPrint(node.leftChild, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
      }


    insertNode(value, currentNode = this.root) {

        if (currentNode.data == null) {
            return new Node(value)
        }

        if (currentNode.data == value) {
            return null
        }

        // if current root is less than value & root.left is null then create a new node setting the root.left as the new value
        if (currentNode.data > value) {
            if (currentNode.leftChild == null) {
                currentNode.leftChild = new Node(value)
            }
            this.insertNode(value, currentNode.leftChild)
        }

        // if root < value then go to root.right
        if (currentNode.data < value) {
            if (currentNode.rightChild == null) {
                currentNode.rightChild = new Node(value)
            }
            this.insertNode(value, currentNode.rightChild)
        }

        return currentNode
    }


    deleteNode(value, currentNode = this.root) {

        if (currentNode.data == null) {
            return currentNode.data
        }

        // Traverse to the node to be deleted or where currentNode.data equals the value
        if (currentNode.data > value) {
            currentNode.leftChild = this.deleteNode(value, currentNode.leftChild);
            return currentNode;
        } else if (currentNode.data < value) {
            currentNode.rightChild = this.deleteNode(value, currentNode.rightChild);
            return currentNode;
        }

        // Once node to be deleted is found, delete it
        if (currentNode.leftChild == null) {
            return currentNode.rightChild;
        } else if (currentNode.rightChild == null) {
            return currentNode.leftChild;
        }

        // if the node to be deleted has two child, get the in-order successor. In-order successor finds the minimum value in the right subtree of the node
        let minRightNode = currentNode.rightChild;
        while (minRightNode.leftChild != null) {
            minRightNode = minRightNode.leftChild
        }

        // replace the node to be deleted with its in-order successor
        currentNode.data = minRightNode.data;

        // delete the in-order successor
        currentNode.rightChild = this.deleteNode(minRightNode.data, currentNode.rightChild);

        return currentNode;

    }

    
    find (value, currentNode = this.root) {
        
        // if value == root.value then return current node
        if (currentNode == null || currentNode.data == value) {
            return currentNode
        }

        // tranverse to through the tree
        if (currentNode.data > value) {
            return this.find(value, currentNode.leftChild)
        } else if (currentNode.data < value) {
            return this.find(value, currentNode.rightChild)
        }
    }

    // breadth-first method where u start from the root
    levelOrder(currentNode = this.root) {

        const queue = [];
        const result = [];

        if (currentNode == null) {
            return [];
        }

        // find the starting root
        if (currentNode != null) {
            queue.push(currentNode);
        }

        while (queue.length > 0) {

            // return the first value in the array or at index 0
            let current = queue.shift();
            result.push(current.data);

            if (current.leftChild != null) {
                queue.push(current.leftChild);
            }

            if (current.rightChild != null) {
                queue.push(current.rightChild)
            }
        }

        return result
    }

    // <root> --> <left-subtree> --> <right-subtree>
    preorder(curretNode = this.root, result = []) {

        if (curretNode != null) {
            result.push(curretNode.data)
            this.preorder(curretNode.leftChild, result);
            this.preorder(curretNode.rightChild, result)
        }

        return result
    }

    // <left-subtree> --> <root> --> <right-subtree>
    inorder(currentNode = this.root, result = []) {

        if (currentNode != null) {
            this.inorder(currentNode.leftChild, result);
            result.push(currentNode.data)
            this.inorder(currentNode.rightChild, result)
        }

        return result
    }

    // <left-subtree> --> <right-subtree> --> <root>
    postorder(currentNode = this.root, result = []) {

        if (currentNode != null) {
            this.postorder(currentNode.leftChild, result);
            this.postorder(currentNode.rightChild, result)
            result.push(currentNode.data)
        }

        return result
    }

    // height = number of edges in longest path from the node to a leaf node
    // height describes how far a node is from the bottom of the tree
    height(currentNode = this.root) {
        
        if (currentNode == null) {
            return 0;
        } else {
            let leftHeight = this.height(currentNode.leftChild);
            let rightHeight = this.height(currentNode.rightChild);

            // return the leftChild & rightChild height and determine which of the 2's height is bigger
            return Math.max(leftHeight, rightHeight) + 1;

        }
    }

    // depth describes how far a node is from the top of the tree
    depth(currentNode = this.root) {
        let current = currentNode;
        let depth = 0;

        while(current.parentNode != null) {
            current = current.parentNode
            depth++
        }

        return depth
    }

    // starts from the root and goes down both left & right subtree to determine if both side is balanced
    isbalanced(currentNode = this.root) {

        // Base case: an empty tree is always balanced
        if (currentNode == null) {
            return true;
        }

        // Recursively check if left and right subtrees are balanced
        let leftHeight = this.height(currentNode.leftChild);
        let rightHeight = this.height(currentNode.rightChild);
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return false;
        }
        return this.isbalanced(currentNode.leftChild) && this.isbalanced(currentNode.rightChild)

    }

    // traversing - prcoess in which each element of data structure is accessed
    // traverse through the current built tree and build a new Tree with the buildTree function
    rebalance() {

        const inorderArray = this.inorder();
        this.root = this.buildTree(inorderArray);

    }
}

const tree = new Tree(sampleArray);
tree.insertNode(3)
tree.insertNode(999)
tree.insertNode(1000)
tree.insertNode(0)
tree.prettyPrint()

tree.deleteNode(0)
tree.deleteNode(1000)
tree.find(78)

tree.prettyPrint()
tree.levelOrder()

let inorderResult = tree.inorder();
let preorderResult = tree.preorder();
let postorderResult = tree.postorder();

console.log(inorderResult);
console.log(preorderResult);
console.log(postorderResult);


// need to work a bit more on height and depth
let height = tree.height()
console.log(height)

let depth = tree.depth()
console.log(depth)

let isbalanced = tree.isbalanced()
console.log(isbalanced)

let rebalance = tree.rebalance()
console.log(rebalance)

tree.prettyPrint()



function unbalance_tree() {

    let basenumber = 100

    for (let i=100; i<basenumber+20; i++) {
        tree.insertNode(i)
    }
}

unbalance_tree()
tree.prettyPrint()

let isbalancedV2 = tree.isbalanced();
console.log(isbalancedV2);

let new_inorderArray = tree.inorder();
let rebalanceV2 = tree.rebalance()
tree.prettyPrint()

let isbalancedV2_test2 = tree.isbalanced();
console.log(isbalancedV2_test2);

let inorderResultV2 = tree.inorder();
let preorderResultV2 = tree.preorder();
let postorderResultV2 = tree.postorder();

console.log(inorderResultV2);
console.log(preorderResultV2);
console.log(postorderResultV2);