export class PagerService {
	getPager(totalItems: number, currentPage: number = 1, pageSize: number = 9) {
		let totalPages = Math.ceil(totalItems / pageSize);

		let startPage, endPage;
		if (totalPages <= 10) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= 6) {
				startPage = 1;
				endPage = 10;
			} else if (currentPage + 4 >= totalPages) {
				startPage = totalPages - 9;
				endPage = totalPages;
			} else {
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
		}

		let startIndex = (currentPage - 1) * pageSize;
		let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

		// console.info(`currentPage: ${currentPage}`);
		// console.info(`totalPages: ${totalPages}`);
		// console.info(`startIndex: ${startIndex}`);
		// console.info(`endIndex: ${endIndex}`);

		let pages = [];
		for (let i = startPage; i <= endPage; i++)
			pages.push(i);

		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		};
	}
}