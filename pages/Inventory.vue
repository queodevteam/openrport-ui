<template>
	<new-page-wrapper>
		<div class="app-page mx-auto min-h-0 w-full max-w-7xl overflow-y-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
			<div class="relative z-20 flex min-h-16 flex-wrap items-center justify-between gap-3">
				<div class="">
					<h3 class="text-2xl font-semibold leading-tight text-gray-800 dark:text-white">
						Inventory
					</h3>
				</div>
				<div class="flex-1" />
				<div class="ml-2 flex-shrink-0">
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
&nbsp;
					</p>
				</div>
			</div>
			<div class="w-full">
				<div class="relative z-10 w-full">
					<!---->
					<div
						class="flow-root overflow-hidden border border-gray-100 ring-1 ring-black ring-opacity-10 dark:border-gray-600 sm:rounded-lg"
					>
						<div class="overflow-auto relative z-10 -mb-2">
							<div class="inline-block min-w-full align-middle">
								<div class="sm:rounded-t-lg overflow-hidden">
									<div>
										<table class="app-table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
											<thead class="rounded-lg bg-gray-50 dark:bg-gray-950">
												<tr>
													<th
														class="w-10 text-right py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button disabled="">
															<span /><!---->
														</button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>Client</span><!----></button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>ID</span><!----></button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>OS</span><!----></button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>IPs</span><!----></button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>IPv4</span><!----></button>
													</th>
													<th
														class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button><span>Client Version</span><!----></button>
													</th>
													<th
														class="text-center py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button
															disabled=""
														>
															<span>Updates</span><!---->
														</button>
													</th>
													<th
														class="text-center py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
														scope="col"
													>
														<button disabled="">
															<span>Security
																Updates</span><!---->
														</button>
													</th><!----><!---->
												</tr>
											</thead>
											<tbody
												class="z-10 divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
											>
												<tr class="h-[210px] bg-white/10 backdrop-blur-sm dark:bg-black/10">
													<td
														colspan="10"
														class="w-full flex-1 text-center text-gray-800 dark:text-gray-200"
													>
														<AppEmpty>No clients in the inventory.</AppEmpty>
													</td><!---->
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="h-12 w-full" />
				</div>
				<div />
			</div>
		</div>
		<!-- <div class="container mt-4">
            <page-header title="Inventory" />
            <div class="row">
                <div class="col">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Filter clients by name or IP Address"
                            aria-label="Filter clients by name or IP Address" aria-describedby="button-addon2">

                        <button class="btn btn-primary" type="button" id="button-addon2">
                            More filters
                            <IconFilter :size="20" stroke-width="1" class="ps-1" />
                        </button>
                    </div>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-primary rounded" @click="showOptions = true">
                        <IconTable :size="20" stroke-width="1" class="pe-1" />
                        Customize Table
                    </button>
                </div>
            </div>
             -- <page-table /> --
            <div v-show="showOptions">
                <div class="card table-responsive mb-3">
                    <div class="card-header bg-body border-0">
                        <IconTable :size="20" stroke-width="1" class="pe-1" />
                        Customize table
                    </div>
                    <div class="card-body bg-body">
                        <div class="row">
                            <div class="col">
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Connection State</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Kernel</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">CPU Model</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Memory</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Client Version</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Client groups</span>
                                </label>
                            </div>
                            <div class="col">
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Name</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Arch.</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Version</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">CPU Model Name</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">IPs</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Tags</span>
                                </label>
                            </div>
                            <div class="col">
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Client</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Family</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Virt. Role</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">CPU Vendor</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">IPv4</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Updates</span>
                                </label>
                            </div>
                            <div class="col">
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">ID</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">OS Full Name</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">CPU Family</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">No. of CPUs</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">IPv6</span>
                                </label>
                                <label class="form-check">
                                    <input class="form-check-input" type="checkbox" checked="">
                                    <span class="form-check-label">Security Updates</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-body border-0 mb-3">
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary align-items-end" @click="showOptions = false">Apply</button>
                    </div>
                </div>
            </div>
            <div class="card table-responsive">
                <table class="table table-vcenter">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>ID</th>
                            <th>OS</th>
                            <th>IPs</th>
                            <th>IPv4</th>
                            <th>Client version</th>
                            <th>Updates</th>
                            <th>Security updates</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>My raspberry</td>
                            <td class="text-secondary">
                                1234-abcd-5678-efgh
                            </td>
                            <td class="text-secondary">
                                <a href="#" class="text-reset">Linux raspberry</a>
                            </td>
                            <td class="text-secondary">
                                192.168.0.1 aa11::bb22::cc33::dd44::ee55
                            </td>
                            <td>192.168.0.1</td>
                            <td>
                                <span class="badge">0.9.14</span>
                            </td>
                            <td>
                                <span class="badge">30</span>
                            </td>
                            <td>
                                <span class="badge">0</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col">
                        <div class="p-2">Showing 1 to 0 of 0 results</div>
                    </div>
                </div>
            </div>
        </div> -->
	</new-page-wrapper>
</template>

<script>
import { IconTable, IconFilter } from '@tabler/icons-vue';

export default {
	components: {
		IconTable,
		IconFilter,
	},
	data() {
		return {
			showOptions: false,
		};
	},
};
</script>

<style scoped></style>
